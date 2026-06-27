using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Expenses;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface IExpenseService
{
    Task<IEnumerable<Expense>> GetAllExpensesAsync(string? search, string? category);
    Task<Expense?> CreateExpenseAsync(ExpenseDto dto);
    Task<bool> UpdateExpenseAsync(Guid id, ExpenseDto dto);
    Task<bool> DeleteExpenseAsync(Guid id);
}
