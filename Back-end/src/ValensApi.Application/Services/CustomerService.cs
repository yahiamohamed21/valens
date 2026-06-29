using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Customers;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class CustomerService : ICustomerService
{
    private readonly IUnitOfWork _unitOfWork;

    public CustomerService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ValensApi.Application.DTOs.Common.PaginatedList<Customer>> GetAllAsync(string? search, int pageNumber = 1, int pageSize = 10)
    {
        var query = _unitOfWork.Customers.GetQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(c =>
                c.FullName.ToLower().Contains(searchLower) ||
                c.Email.ToLower().Contains(searchLower) ||
                c.Phone.ToLower().Contains(searchLower) ||
                c.City.ToLower().Contains(searchLower)
            );
        }

        query = query.OrderByDescending(c => c.TotalSpent);

        var totalCount = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new ValensApi.Application.DTOs.Common.PaginatedList<Customer>(items, totalCount, pageNumber, pageSize);
    }

    public async Task<object?> GetByIdAsync(Guid id)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(id);
        if (customer == null)
        {
            return null;
        }

        var orders = await _unitOfWork.Orders.FindAsync(o => o.CustomerId == id);

        return new
        {
            Customer = customer,
            Orders = orders.OrderByDescending(o => o.CreatedAt)
        };
    }

    public async Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
    {
        var customers = await _unitOfWork.Customers.FindAsync(c => c.UserId == userId);
        var customer = customers.FirstOrDefault();

        if (customer == null)
        {
            return false;
        }

        customer.FullName = dto.FullName;
        customer.Phone = dto.Phone;
        customer.Address = dto.Address;
        customer.City = dto.City;

        _unitOfWork.Customers.Update(customer);

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user != null)
        {
            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.Address = dto.Address;
            user.City = dto.City;
            _unitOfWork.Users.Update(user);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
