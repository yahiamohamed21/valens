using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Orders;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;

    public OrderService(IUnitOfWork unitOfWork, IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _emailService = emailService;
    }

    public async Task<object> CreateOrderAsync(CheckoutDto dto, Guid? loggedInUserId, bool isAuthenticated)
    {
        if (string.IsNullOrWhiteSpace(dto.CustomerName) ||
            string.IsNullOrWhiteSpace(dto.CustomerEmail) ||
            string.IsNullOrWhiteSpace(dto.CustomerPhone) ||
            string.IsNullOrWhiteSpace(dto.ShippingAddress) ||
            string.IsNullOrWhiteSpace(dto.ShippingCity) ||
            dto.Items == null || !dto.Items.Any())
        {
            throw new ArgumentException("All checkout fields (Name, Email, Phone, Address, City) are required and cannot be empty.");
        }

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            Customer? customer = null;

            // 1. Resolve Customer profile
            if (isAuthenticated && loggedInUserId.HasValue && loggedInUserId.Value != Guid.Empty)
            {
                var customerList = await _unitOfWork.Customers.FindAsync(c => c.UserId == loggedInUserId.Value);
                customer = customerList.FirstOrDefault();

                if (customer == null)
                {
                    var user = await _unitOfWork.Users.GetByIdAsync(loggedInUserId.Value);
                    customer = new Customer
                    {
                        UserId = loggedInUserId.Value,
                        FullName = user?.FullName ?? dto.CustomerName,
                        Email = user?.Email ?? dto.CustomerEmail,
                        Phone = user?.Phone ?? dto.CustomerPhone,
                        Address = user?.Address ?? dto.ShippingAddress,
                        City = user?.City ?? dto.ShippingCity
                    };
                    await _unitOfWork.Customers.AddAsync(customer);
                    await _unitOfWork.SaveChangesAsync();
                }
                else
                {
                    customer.FullName = dto.CustomerName;
                    customer.Phone = dto.CustomerPhone;
                    customer.Address = dto.ShippingAddress;
                    customer.City = dto.ShippingCity;
                    _unitOfWork.Customers.Update(customer);
                }
            }

            if (customer == null)
            {
                var customerList = await _unitOfWork.Customers.FindAsync(c => c.Email.ToLower() == dto.CustomerEmail.ToLower());
                customer = customerList.FirstOrDefault();

                if (customer != null)
                {
                    customer.FullName = dto.CustomerName;
                    customer.Phone = dto.CustomerPhone;
                    customer.Address = dto.ShippingAddress;
                    customer.City = dto.ShippingCity;
                    _unitOfWork.Customers.Update(customer);
                }
                else
                {
                    customer = new Customer
                    {
                        FullName = dto.CustomerName,
                        Email = dto.CustomerEmail,
                        Phone = dto.CustomerPhone,
                        Address = dto.ShippingAddress,
                        City = dto.ShippingCity,
                        TotalOrders = 0,
                        TotalSpent = 0
                    };
                    await _unitOfWork.Customers.AddAsync(customer);
                    await _unitOfWork.SaveChangesAsync();
                }
            }

            // 2. Validate inventory & calculate prices
            decimal subtotal = 0;
            var orderItems = new List<OrderItem>();

            foreach (var cartItem in dto.Items)
            {
                var product = await _unitOfWork.Products.GetQueryable()
                    .Include(p => p.Variants)
                    .FirstOrDefaultAsync(p => p.Id == cartItem.ProductId);

                if (product == null)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new KeyNotFoundException($"Product with ID {cartItem.ProductId} was not found.");
                }

                decimal price = 0;
                string size = string.Empty;
                string flavor = string.Empty;

                if (product.VariantType != "none")
                {
                    if (string.IsNullOrEmpty(cartItem.VariantId))
                    {
                        await _unitOfWork.RollbackTransactionAsync();
                        throw new ArgumentException($"Product '{product.Name}' requires selecting a size/flavor variant.");
                    }

                    var variant = product.Variants.FirstOrDefault(v => v.VariantId == cartItem.VariantId);
                    if (variant == null)
                    {
                        await _unitOfWork.RollbackTransactionAsync();
                        throw new KeyNotFoundException($"Variant '{cartItem.VariantId}' for product '{product.Name}' was not found.");
                    }

                    if (variant.StockQuantity < cartItem.Quantity)
                    {
                        await _unitOfWork.RollbackTransactionAsync();
                        throw new InvalidOperationException($"Requested quantity of '{product.Name} - {variant.Size} {variant.Flavor}' is not available. Available stock: {variant.StockQuantity}.");
                    }

                    variant.StockQuantity -= cartItem.Quantity;
                    product.Stock -= cartItem.Quantity;

                    price = variant.DiscountPrice > 0 ? variant.DiscountPrice : variant.Price;
                    size = variant.Size;
                    flavor = variant.Flavor;

                    _unitOfWork.ProductVariants.Update(variant);
                }
                else
                {
                    if (product.Stock < cartItem.Quantity)
                    {
                        await _unitOfWork.RollbackTransactionAsync();
                        throw new InvalidOperationException($"Requested quantity of '{product.Name}' is not available. Available stock: {product.Stock}.");
                    }

                    product.Stock -= cartItem.Quantity;
                    price = product.DiscountPrice > 0 ? product.DiscountPrice : product.Price;
                }

                _unitOfWork.Products.Update(product);

                subtotal += price * cartItem.Quantity;

                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    VariantId = cartItem.VariantId ?? string.Empty,
                    Size = size,
                    Flavor = flavor,
                    Price = price,
                    Quantity = cartItem.Quantity
                });
            }

            // 3. Process Coupon
            decimal discountAmount = 0;
            if (!string.IsNullOrEmpty(dto.CouponCode))
            {
                var coupons = await _unitOfWork.Coupons.FindAsync(c => c.Code.ToLower() == dto.CouponCode.ToLower());
                var coupon = coupons.FirstOrDefault();

                if (coupon != null && coupon.IsActive && coupon.ExpiryDate > DateTimeOffset.UtcNow)
                {
                    if (coupon.MaxUsage == null || coupon.UsageCount < coupon.MaxUsage.Value)
                    {
                        if (subtotal >= coupon.MinOrderAmount)
                        {
                            if (coupon.DiscountType.ToLower() == "percentage")
                            {
                                discountAmount = Math.Round(subtotal * (coupon.DiscountValue / 100), 2);
                            }
                            else
                            {
                                discountAmount = coupon.DiscountValue;
                            }

                            if (discountAmount > subtotal)
                            {
                                discountAmount = subtotal;
                            }

                            coupon.UsageCount += 1;
                            _unitOfWork.Coupons.Update(coupon);
                        }
                    }
                }
            }

            // 4. Calculate Shipping Cost
            decimal shippingCost = 60;
            decimal freeShippingThreshold = 1500;

            var settingsList = await _unitOfWork.StoreSettings.GetAllAsync();
            var settings = settingsList.FirstOrDefault();
            if (settings != null)
            {
                shippingCost = settings.ShippingCost;
                freeShippingThreshold = settings.FreeShippingThreshold;
            }

            if (subtotal >= freeShippingThreshold)
            {
                shippingCost = 0;
            }

            decimal total = subtotal + shippingCost - discountAmount;

            // Generate Numeric Order Code (VL- followed by strictly numbers like Ticks / Timestamp)
            string orderCode = $"VL-{DateTime.UtcNow:yyyyMMddHHmmssfff}";

            // 5. Create Order
            var order = new Order
            {
                OrderNumber = orderCode,
                CustomerId = customer.Id,
                CustomerName = dto.CustomerName,
                CustomerEmail = dto.CustomerEmail,
                CustomerPhone = dto.CustomerPhone,
                ShippingAddress = dto.ShippingAddress,
                ShippingCity = dto.ShippingCity,
                Status = "New",
                PaymentMethod = "Cash on Delivery", // COD
                Subtotal = subtotal,
                ShippingCost = shippingCost,
                DiscountAmount = discountAmount,
                CouponCode = dto.CouponCode ?? string.Empty,
                Total = total,
                Items = orderItems
            };

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // 6. Update Customer stats
            customer.TotalOrders += 1;
            customer.TotalSpent += total;
            _unitOfWork.Customers.Update(customer);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();

            return new
            {
                Message = "Order created successfully and is being prepared.",
                OrderNumber = order.OrderNumber,
                OrderId = order.Id,
                Total = order.Total,
                PaymentMethod = order.PaymentMethod
            };
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<IEnumerable<Order>> GetMyOrdersAsync(Guid userId)
    {
        var customerList = await _unitOfWork.Customers.FindAsync(c => c.UserId == userId);
        var customer = customerList.FirstOrDefault();

        if (customer == null)
        {
            return new List<Order>();
        }

        return await _unitOfWork.Orders.GetQueryable()
            .Include(o => o.Items)
            .Where(o => o.CustomerId == customer.Id)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetAllOrdersAsync(string? search, string? category)
    {
        var query = _unitOfWork.Orders.GetQueryable()
            .Include(o => o.Items)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(searchLower) ||
                o.CustomerName.ToLower().Contains(searchLower) ||
                o.CustomerPhone.ToLower().Contains(searchLower)
            );
        }

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();

        if (!string.IsNullOrEmpty(category))
        {
            var categoryLower = category.ToLower();
            var products = await _unitOfWork.Products.GetAllAsync();
            var productCategoryMap = products.ToDictionary(p => p.Id, p => p.CategoryName.ToLower());

            orders = orders.Where(o => o.Items.Any(item =>
                productCategoryMap.TryGetValue(item.ProductId, out var cat) && cat == categoryLower
            )).ToList();
        }

        return orders;
    }

    public async Task<bool> UpdateStatusAsync(Guid id, string status)
    {
        var order = await _unitOfWork.Orders.GetQueryable()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return false;
        }

        string oldStatus = order.Status;
        order.Status = status;
        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync();

        if (status.Equals("Confirmed", StringComparison.OrdinalIgnoreCase) && 
            !oldStatus.Equals("Confirmed", StringComparison.OrdinalIgnoreCase))
        {
            try
            {
                await _emailService.SendOrderConfirmationEmailAsync(order);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order confirmation email: {ex.Message}");
            }
        }

        return true;
    }

    public async Task<bool> UpdateOrderDetailsAsync(UpdateOrderDto dto)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(dto.Id);
        if (order == null)
        {
            return false;
        }

        order.CustomerName = dto.CustomerName;
        order.CustomerPhone = dto.CustomerPhone;
        order.ShippingAddress = dto.ShippingAddress;
        order.ShippingCity = dto.ShippingCity;

        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
