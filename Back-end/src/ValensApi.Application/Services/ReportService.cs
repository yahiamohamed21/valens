using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class ReportService : IReportService
{
    private readonly IUnitOfWork _unitOfWork;

    public ReportService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<object> GetDashboardReportAsync()
    {
        var orders = await _unitOfWork.Orders.GetQueryable()
            .Include(o => o.Items)
            .Where(o => o.Status != "Cancelled")
            .ToListAsync();

        var expensesList = await _unitOfWork.Expenses.GetAllAsync();
        var expenses = expensesList.ToList();

        decimal totalSales = orders.Sum(o => o.Total);
        decimal totalExpenses = expenses.Sum(e => e.Amount);
        decimal netProfit = totalSales - totalExpenses;
        int salesCount = orders.Count;
        decimal averageOrderValue = salesCount > 0 ? Math.Round(totalSales / salesCount, 2) : 0;

        var salesOverTime = orders
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new
            {
                Date = g.Key.ToString("yyyy-MM-dd"),
                Amount = g.Sum(o => o.Total)
            })
            .OrderBy(x => x.Date)
            .Take(30)
            .ToList();

        var productsList = await _unitOfWork.Products.GetAllAsync();
        var productCategoryMap = productsList.ToDictionary(p => p.Id, p => p.CategoryName);

        var salesByCategory = orders.SelectMany(o => o.Items)
            .GroupBy(item => productCategoryMap.TryGetValue(item.ProductId, out var cat) ? cat : "Other")
            .Select(g => new
            {
                Category = g.Key,
                Amount = g.Sum(i => i.Price * i.Quantity)
            })
            .ToList();

        var expensesByCategory = expenses
            .GroupBy(e => e.Category)
            .Select(g => new
            {
                Category = g.Key,
                Amount = g.Sum(e => e.Amount)
            })
            .ToList();

        return new
        {
            TotalSales = totalSales,
            TotalExpenses = totalExpenses,
            NetProfit = netProfit,
            SalesCount = salesCount,
            AverageOrderValue = averageOrderValue,
            SalesOverTime = salesOverTime,
            SalesByCategory = salesByCategory,
            ExpensesByCategory = expensesByCategory
        };
    }
}
