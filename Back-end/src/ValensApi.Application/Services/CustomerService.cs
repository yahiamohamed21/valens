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

    public async Task<IEnumerable<Customer>> GetAllAsync(string? search)
    {
        if (string.IsNullOrEmpty(search))
        {
            var customers = await _unitOfWork.Customers.GetAllAsync();
            return customers.OrderByDescending(c => c.TotalSpent);
        }

        var searchLower = search.ToLower();
        var matched = await _unitOfWork.Customers.FindAsync(c =>
            c.FullName.ToLower().Contains(searchLower) ||
            c.Email.ToLower().Contains(searchLower) ||
            c.Phone.ToLower().Contains(searchLower) ||
            c.City.ToLower().Contains(searchLower)
        );

        return matched.OrderByDescending(c => c.TotalSpent);
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
