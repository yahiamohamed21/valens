using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Expenses;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ValensApi.Application.Services;

public class ExpenseService : IExpenseService
{
    private readonly IUnitOfWork _unitOfWork;

    public ExpenseService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ValensApi.Application.DTOs.Common.PaginatedList<Expense>> GetAllExpensesAsync(string? search, string? category, int pageNumber = 1, int pageSize = 10)
    {
        var query = _unitOfWork.Expenses.GetQueryable().AsNoTracking();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(e => e.Category.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(e => e.Title.ToLower().Contains(searchLower));
        }

        query = query.OrderByDescending(e => e.Date);

        var totalCount = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new ValensApi.Application.DTOs.Common.PaginatedList<Expense>(items, totalCount, pageNumber, pageSize);
    }

    public async Task<Expense?> CreateExpenseAsync(ExpenseDto dto)
    {
        var expense = new Expense
        {
            Title = dto.Title,
            Amount = dto.Amount,
            Category = dto.Category,
            Date = dto.Date ?? DateTimeOffset.UtcNow
        };

        await _unitOfWork.Expenses.AddAsync(expense);
        await _unitOfWork.SaveChangesAsync();
        return expense;
    }

    public async Task<bool> UpdateExpenseAsync(Guid id, ExpenseDto dto)
    {
        var expense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (expense == null)
        {
            return false;
        }

        expense.Title = dto.Title;
        expense.Amount = dto.Amount;
        expense.Category = dto.Category;
        if (dto.Date.HasValue)
        {
            expense.Date = dto.Date.Value;
        }

        _unitOfWork.Expenses.Update(expense);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteExpenseAsync(Guid id)
    {
        var expense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (expense == null)
        {
            return false;
        }

        _unitOfWork.Expenses.Delete(expense);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
