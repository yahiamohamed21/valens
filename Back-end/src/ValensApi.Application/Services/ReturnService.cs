using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Returns;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class ReturnService : IReturnService
{
    private readonly IUnitOfWork _unitOfWork;

    public ReturnService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<OrderReturn> CreateReturnAsync(CreateReturnDto dto)
    {
        return await _unitOfWork.ExecuteInTransactionAsync<OrderReturn>(async () =>
        {
            var order = await _unitOfWork.Orders.GetQueryable()
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == dto.OrderId);

            if (order == null)
            {
                throw new ArgumentException($"Order with ID {dto.OrderId} was not found.");
            }

            if (order.Status.Equals("RETURNED", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("This order has already been marked as returned.");
            }

            var itemDescriptions = new List<string>();

            // Determine which items are being returned
            if (dto.Items != null && dto.Items.Any())
            {
                foreach (var itemDto in dto.Items)
                {
                    var orderItem = order.Items.FirstOrDefault(i => i.ProductId == itemDto.ProductId && 
                        (string.IsNullOrEmpty(itemDto.VariantId) || i.VariantId == itemDto.VariantId));

                    if (orderItem == null)
                    {
                        throw new ArgumentException($"Product ID {itemDto.ProductId} was not found in Order {order.OrderNumber}.");
                    }

                    int returnQty = Math.Min(itemDto.Quantity, orderItem.Quantity);
                    if (returnQty <= 0) continue;

                    string specDetails = string.Empty;
                    if (!string.IsNullOrEmpty(orderItem.Size) || !string.IsNullOrEmpty(orderItem.Flavor))
                    {
                        specDetails = $" ({orderItem.Size} {orderItem.Flavor})";
                    }
                    itemDescriptions.Add($"{orderItem.ProductName}{specDetails} x {returnQty}");

                    if (dto.IsRestoredToStock)
                    {
                        var product = await _unitOfWork.Products.GetQueryable()
                            .Include(p => p.Variants)
                            .FirstOrDefaultAsync(p => p.Id == orderItem.ProductId);

                        if (product != null)
                        {
                            product.Stock += returnQty;

                            if (product.VariantType != "none" && !string.IsNullOrEmpty(orderItem.VariantId))
                            {
                                var variant = product.Variants.FirstOrDefault(v => v.VariantId == orderItem.VariantId);
                                if (variant != null)
                                {
                                    variant.StockQuantity += returnQty;
                                    _unitOfWork.ProductVariants.Update(variant);
                                }
                            }

                            _unitOfWork.Products.Update(product);
                        }
                    }
                }
            }
            else
            {
                // Return all items in the order
                foreach (var orderItem in order.Items)
                {
                    string specDetails = string.Empty;
                    if (!string.IsNullOrEmpty(orderItem.Size) || !string.IsNullOrEmpty(orderItem.Flavor))
                    {
                        specDetails = $" ({orderItem.Size} {orderItem.Flavor})";
                    }
                    itemDescriptions.Add($"{orderItem.ProductName}{specDetails} x {orderItem.Quantity}");

                    if (dto.IsRestoredToStock)
                    {
                        var product = await _unitOfWork.Products.GetQueryable()
                            .Include(p => p.Variants)
                            .FirstOrDefaultAsync(p => p.Id == orderItem.ProductId);

                        if (product != null)
                        {
                            product.Stock += orderItem.Quantity;

                            if (product.VariantType != "none" && !string.IsNullOrEmpty(orderItem.VariantId))
                            {
                                var variant = product.Variants.FirstOrDefault(v => v.VariantId == orderItem.VariantId);
                                if (variant != null)
                                {
                                    variant.StockQuantity += orderItem.Quantity;
                                    _unitOfWork.ProductVariants.Update(variant);
                                }
                            }

                            _unitOfWork.Products.Update(product);
                        }
                    }
                }
            }

            // Set Order Status to RETURNED
            order.Status = "RETURNED";
            _unitOfWork.Orders.Update(order);

            // Log Order Return Record
            var orderReturn = new OrderReturn
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                CustomerName = order.CustomerName,
                ReturnDate = DateTimeOffset.UtcNow,
                ReturnedFormulations = string.Join(", ", itemDescriptions),
                ReturnReason = dto.ReturnReason,
                IsRestoredToStock = dto.IsRestoredToStock,
                RefundAmount = dto.RefundAmount,
                Notes = dto.Notes
            };

            await _unitOfWork.OrderReturns.AddAsync(orderReturn);
            await _unitOfWork.SaveChangesAsync();

            return orderReturn;
        });
    }

    public async Task<IEnumerable<OrderReturn>> GetAllReturnsAsync()
    {
        var returns = await _unitOfWork.OrderReturns.GetAllAsync();
        return returns.OrderByDescending(r => r.ReturnDate);
    }
}
