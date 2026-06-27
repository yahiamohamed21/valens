using System.Threading.Tasks;

namespace ValensApi.Application.Interfaces;

public interface IReportService
{
    Task<object> GetDashboardReportAsync();
}
