using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Common;
using ValensApi.Application.DTOs.Expenses;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.API.Controllers;

[Authorize(Roles = "Admin")]
public class ExpensesController : BaseApiController
{
    private readonly IExpenseService _expenseService;

    public ExpensesController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    [HttpGet("list-admin")]
    public async Task<ActionResult<IEnumerable<Expense>>> GetAdminExpenses()
    {
        var expenses = await _expenseService.GetAllExpensesAsync();
        return Ok(expenses);
    }

    [HttpPost("create-expense")]
    public async Task<ActionResult<Expense>> CreateExpense([FromBody] ExpenseDto dto)
    {
        var expense = await _expenseService.CreateExpenseAsync(dto);
        return CreatedAtAction(nameof(GetAdminExpenses), new { id = expense?.Id }, expense);
    }

    [HttpPost("update-expense")]
    public async Task<IActionResult> UpdateExpense([FromBody] ExpenseDto dto)
    {
        if (!dto.Id.HasValue)
        {
            return BadRequest("Expense Id is required for updates.");
        }

        var success = await _expenseService.UpdateExpenseAsync(dto.Id.Value, dto);
        if (!success)
        {
            return NotFound("Expense not found.");
        }

        return NoContent();
    }

    [HttpPost("delete-expense")]
    public async Task<IActionResult> DeleteExpense([FromBody] IdRequestDto dto)
    {
        var success = await _expenseService.DeleteExpenseAsync(dto.Id);
        if (!success)
        {
            return NotFound("Expense not found.");
        }

        return NoContent();
    }
}
