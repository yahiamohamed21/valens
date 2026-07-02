using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Returns;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface IReturnService
{
    Task<OrderReturn> CreateReturnAsync(CreateReturnDto dto);
    Task<IEnumerable<OrderReturn>> GetAllReturnsAsync();
}
