using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Customers;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface ICustomerService
{
    Task<ValensApi.Application.DTOs.Common.PaginatedList<Customer>> GetAllAsync(string? search, int pageNumber = 1, int pageSize = 10);
    Task<object?> GetByIdAsync(Guid id);
    Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);
}
