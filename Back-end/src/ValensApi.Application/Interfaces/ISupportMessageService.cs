using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Support;

namespace ValensApi.Application.Interfaces;

public interface ISupportMessageService
{
    Task<SimpleResponseDto> CreateAsync(SupportMessageRequestDto dto);
    Task<List<SupportMessageResponseDto>> GetAllAsync();
    Task<bool> DeleteAsync(Guid id);
}
