using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ValensApi.Application.Interfaces;

namespace ValensApi.API.Controllers;

[Authorize(Roles = "Admin")]
public class ReportsController : BaseApiController
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("dashboard-summary")]
    public async Task<IActionResult> GetDashboardReport()
    {
        var result = await _reportService.GetDashboardReportAsync();
        return Ok(result);
    }
}
