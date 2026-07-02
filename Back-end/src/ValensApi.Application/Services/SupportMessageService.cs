using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Support;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class SupportMessageService : ISupportMessageService
{
    private readonly IUnitOfWork _unitOfWork;

    public SupportMessageService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<SimpleResponseDto> CreateAsync(SupportMessageRequestDto dto)
    {
        var message = new SupportMessage
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Message = dto.Message
        };

        await _unitOfWork.SupportMessages.AddAsync(message);
        await _unitOfWork.SaveChangesAsync();

        return new SimpleResponseDto
        {
            Success = true,
            Message = "Message sent successfully"
        };
    }

    public async Task<List<SupportMessageResponseDto>> GetAllAsync()
    {
        var messages = await _unitOfWork.SupportMessages.GetQueryable()
            .OrderByDescending(m => m.CreatedAt)
            .AsNoTracking()
            .ToListAsync();

        return messages.Select(MapToResponseDto).ToList();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var message = await _unitOfWork.SupportMessages.GetByIdAsync(id);
        if (message == null) return false;

        _unitOfWork.SupportMessages.SoftDelete(message);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    private static SupportMessageResponseDto MapToResponseDto(SupportMessage message)
    {
        return new SupportMessageResponseDto
        {
            Id = message.Id,
            Name = message.Name,
            Email = message.Email,
            Phone = message.Phone,
            Message = message.Message,
            CreatedAt = message.CreatedAt
        };
    }
}
