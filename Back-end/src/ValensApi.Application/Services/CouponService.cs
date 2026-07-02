using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Coupons;
using ValensApi.Application.DTOs.Orders;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ValensApi.Application.Services;

public class CouponService : ICouponService
{
    private readonly IUnitOfWork _unitOfWork;

    public CouponService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<object> ValidateCouponAsync(ValidateCouponDto dto)
    {
        var coupons = await _unitOfWork.Coupons.FindAsync(c => c.Code.ToLower() == dto.Code.ToLower());
        var coupon = coupons.FirstOrDefault();

        if (coupon == null)
        {
            throw new ArgumentException("Coupon code not found.");
        }

        if (!coupon.IsActive)
        {
            throw new InvalidOperationException("Coupon code is currently inactive.");
        }

        if (coupon.ExpiryDate.HasValue && coupon.ExpiryDate.Value < DateTimeOffset.UtcNow)
        {
            throw new InvalidOperationException("This coupon code has expired.");
        }

        if (coupon.MaxUsage.HasValue && coupon.UsageCount >= coupon.MaxUsage.Value)
        {
            throw new InvalidOperationException("Maximum usage count reached for this coupon code.");
        }

        decimal subtotal = 0;
        decimal couponEligibleSubtotal = 0;
        decimal percentageDiscountSum = 0;

        if (dto.Items != null && dto.Items.Any())
        {
            foreach (var cartItem in dto.Items)
            {
                var product = await _unitOfWork.Products.GetQueryable()
                    .Include(p => p.Variants)
                    .FirstOrDefaultAsync(p => p.Id == cartItem.ProductId);

                if (product == null)
                {
                    throw new KeyNotFoundException($"Product with ID {cartItem.ProductId} was not found.");
                }

                decimal originalPrice = product.Price;
                decimal discountPrice = product.DiscountPrice;
                ProductVariant? variant = null;

                if (product.VariantType != "none")
                {
                    if (!string.IsNullOrEmpty(cartItem.VariantId))
                    {
                        variant = product.Variants.FirstOrDefault(v => v.VariantId == cartItem.VariantId);
                    }
                    else if (!string.IsNullOrEmpty(cartItem.Size) || !string.IsNullOrEmpty(cartItem.Flavor))
                    {
                        variant = product.Variants.FirstOrDefault(v =>
                            (string.IsNullOrEmpty(cartItem.Size) || v.Size.Equals(cartItem.Size, StringComparison.OrdinalIgnoreCase)) &&
                            (string.IsNullOrEmpty(cartItem.Flavor) || v.Flavor.Equals(cartItem.Flavor, StringComparison.OrdinalIgnoreCase))
                        );
                    }

                    if (variant != null)
                    {
                        originalPrice = variant.Price;
                        discountPrice = variant.DiscountPrice;
                    }
                }

                // Check discount eligibility
                bool hasProductDiscount = discountPrice > 0 && discountPrice < originalPrice;
                decimal productDiscountAmount = hasProductDiscount ? (originalPrice - discountPrice) : 0;

                decimal couponDiscountForThisItem = 0;
                if (coupon.DiscountType.Equals("Percentage", StringComparison.OrdinalIgnoreCase))
                {
                    couponDiscountForThisItem = originalPrice * (coupon.DiscountValue / 100);
                }
                else
                {
                    couponDiscountForThisItem = coupon.DiscountValue;
                }

                bool isEligibleForCoupon = true;
                decimal itemFinalPrice = 0;

                if (hasProductDiscount)
                {
                    if (couponDiscountForThisItem > productDiscountAmount)
                    {
                        isEligibleForCoupon = true;
                        itemFinalPrice = originalPrice; // Remove product discount, use original price to apply coupon
                    }
                    else
                    {
                        isEligibleForCoupon = false;
                        itemFinalPrice = discountPrice; // Keep product discount, cannot use coupon
                    }
                }
                else
                {
                    isEligibleForCoupon = true;
                    itemFinalPrice = originalPrice;
                }

                subtotal += itemFinalPrice * cartItem.Quantity;

                if (isEligibleForCoupon)
                {
                    couponEligibleSubtotal += originalPrice * cartItem.Quantity;
                    if (coupon.DiscountType.Equals("Percentage", StringComparison.OrdinalIgnoreCase))
                    {
                        percentageDiscountSum += Math.Round(originalPrice * cartItem.Quantity * (coupon.DiscountValue / 100), 2);
                    }
                }
            }
        }

        if (subtotal < coupon.MinOrderAmount)
        {
            throw new InvalidOperationException($"Minimum order amount required to apply this coupon is {coupon.MinOrderAmount} EGP. Current total is {subtotal} EGP.");
        }

        decimal discountAmount = 0;
        if (coupon.DiscountType.Equals("Percentage", StringComparison.OrdinalIgnoreCase))
        {
            discountAmount = percentageDiscountSum;
        }
        else
        {
            discountAmount = coupon.DiscountValue;
        }

        // Cap discount at the eligible subtotal
        if (discountAmount > couponEligibleSubtotal)
        {
            discountAmount = couponEligibleSubtotal;
        }
        // Cap discount at overall subtotal
        if (discountAmount > subtotal)
        {
            discountAmount = subtotal;
        }

        decimal newTotal = subtotal - discountAmount;

        return new
        {
            Code = coupon.Code,
            DiscountType = coupon.DiscountType,
            DiscountValue = coupon.DiscountValue,
            MinOrderAmount = coupon.MinOrderAmount,
            Subtotal = subtotal,
            DiscountAmount = discountAmount,
            NewTotal = newTotal
        };
    }

    public async Task<IEnumerable<CouponDetailsDto>> GetAllCouponsAsync()
    {
        var coupons = await _unitOfWork.Coupons.GetAllAsync();
        var allOrders = await _unitOfWork.Orders.GetQueryable()
            .Include(o => o.Items)
            .ToListAsync();

        var result = new List<CouponDetailsDto>();

        foreach (var coupon in coupons)
        {
            var matchingOrders = allOrders
                .Where(o => o.CouponCode.Trim().Equals(coupon.Code.Trim(), StringComparison.OrdinalIgnoreCase))
                .ToList();

            var orderDetails = matchingOrders.Select(o => new CouponOrderDetailsDto
            {
                OrderId = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerName = o.CustomerName,
                OrderDate = o.CreatedAt,
                Status = o.Status,
                Total = o.Total,
                ProductsCount = o.Items.Sum(i => i.Quantity),
                ProductNames = o.Items.Select(i => $"{i.ProductName}{(string.IsNullOrEmpty(i.Size) && string.IsNullOrEmpty(i.Flavor) ? "" : $" ({i.Size} {i.Flavor})")}").ToList()
            }).ToList();

            result.Add(new CouponDetailsDto
            {
                Id = coupon.Id,
                Code = coupon.Code,
                DiscountType = coupon.DiscountType,
                DiscountValue = coupon.DiscountValue,
                ExpiryDate = coupon.ExpiryDate,
                MinOrderAmount = coupon.MinOrderAmount,
                UsageCount = coupon.UsageCount,
                MaxUsage = coupon.MaxUsage,
                IsActive = coupon.IsActive,
                OwnerName = coupon.OwnerName,
                CreatedAt = coupon.CreatedAt,
                TotalOrders = matchingOrders.Count,
                TotalProductsBought = matchingOrders.SelectMany(o => o.Items).Sum(i => i.Quantity),
                TotalRevenue = matchingOrders.Sum(o => o.Total),
                Orders = orderDetails
            });
        }

        return result.OrderByDescending(c => c.CreatedAt);
    }

    public async Task<Coupon?> CreateCouponAsync(CouponDto dto)
    {
        var existing = await _unitOfWork.Coupons.FindAsync(c => c.Code.ToLower() == dto.Code.ToLower());
        if (existing.Any())
        {
            return null;
        }

        var coupon = new Coupon
        {
            Code = dto.Code.ToUpper(),
            DiscountType = dto.DiscountType,
            DiscountValue = dto.DiscountValue,
            ExpiryDate = dto.ExpiryDate,
            MinOrderAmount = dto.MinOrderAmount,
            MaxUsage = dto.MaxUsage,
            IsActive = dto.IsActive,
            UsageCount = 0,
            OwnerName = dto.OwnerName
        };

        await _unitOfWork.Coupons.AddAsync(coupon);
        await _unitOfWork.SaveChangesAsync();
        return coupon;
    }

    public async Task<bool> UpdateCouponAsync(Guid id, CouponDto dto)
    {
        var coupon = await _unitOfWork.Coupons.GetByIdAsync(id);
        if (coupon == null)
        {
            return false;
        }

        coupon.Code = dto.Code.ToUpper();
        coupon.DiscountType = dto.DiscountType;
        coupon.DiscountValue = dto.DiscountValue;
        coupon.ExpiryDate = dto.ExpiryDate;
        coupon.MinOrderAmount = dto.MinOrderAmount;
        coupon.MaxUsage = dto.MaxUsage;
        coupon.IsActive = dto.IsActive;
        coupon.OwnerName = dto.OwnerName;

        _unitOfWork.Coupons.Update(coupon);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteCouponAsync(Guid id)
    {
        var coupon = await _unitOfWork.Coupons.GetByIdAsync(id);
        if (coupon == null)
        {
            return false;
        }

        _unitOfWork.Coupons.Delete(coupon);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleActiveAsync(Guid id)
    {
        var coupon = await _unitOfWork.Coupons.GetByIdAsync(id);
        if (coupon == null)
        {
            return false;
        }

        coupon.IsActive = !coupon.IsActive;
        _unitOfWork.Coupons.Update(coupon);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
