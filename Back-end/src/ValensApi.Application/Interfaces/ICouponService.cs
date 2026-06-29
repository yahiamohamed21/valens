using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Coupons;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface ICouponService
{
    Task<object> ValidateCouponAsync(ValidateCouponDto dto);
    Task<IEnumerable<CouponResponseDto>> GetAllCouponsAsync();
    Task<CouponResponseDto?> CreateCouponAsync(CouponDto dto);
    Task<bool> UpdateCouponAsync(Guid id, CouponDto dto);
    Task<bool> DeleteCouponAsync(Guid id);
    Task<bool> ToggleActiveAsync(Guid id);
}
