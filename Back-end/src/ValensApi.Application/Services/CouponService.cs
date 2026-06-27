using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Coupons;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

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

        if (coupon.ExpiryDate < DateTimeOffset.UtcNow)
        {
            throw new InvalidOperationException("This coupon code has expired.");
        }

        if (coupon.MaxUsage.HasValue && coupon.UsageCount >= coupon.MaxUsage.Value)
        {
            throw new InvalidOperationException("Maximum usage count reached for this coupon code.");
        }

        if (dto.OrderAmount < coupon.MinOrderAmount)
        {
            throw new InvalidOperationException($"Minimum order amount required to apply this coupon is {coupon.MinOrderAmount} EGP.");
        }

        decimal discountAmount = 0;
        if (coupon.DiscountType.ToLower() == "percentage")
        {
            discountAmount = Math.Round(dto.OrderAmount * (coupon.DiscountValue / 100), 2);
        }
        else
        {
            discountAmount = coupon.DiscountValue;
        }

        if (discountAmount > dto.OrderAmount)
        {
            discountAmount = dto.OrderAmount;
        }

        return new
        {
            Code = coupon.Code,
            DiscountType = coupon.DiscountType,
            DiscountValue = coupon.DiscountValue,
            DiscountAmount = discountAmount
        };
    }

    public async Task<IEnumerable<Coupon>> GetAllCouponsAsync()
    {
        var coupons = await _unitOfWork.Coupons.GetAllAsync();
        return coupons.OrderByDescending(c => c.CreatedAt);
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
            UsageCount = 0
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
}
