using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Customers;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface ICustomerService
{
    Task<IEnumerable<Customer>> GetAllAsync(string? search);
    Task<object?> GetByIdAsync(Guid id);
    Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);
}
