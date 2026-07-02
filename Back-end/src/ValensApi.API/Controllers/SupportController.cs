using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Support;
using ValensApi.Application.Interfaces;

namespace ValensApi.API.Controllers;

[ApiController]
[Route("api/support")]
public class SupportController : ControllerBase
{
    private readonly ISupportMessageService _supportMessageService;

    public SupportController(ISupportMessageService supportMessageService)
    {
        _supportMessageService = supportMessageService;
    }

    [HttpPost("messages")]
    public async Task<ActionResult<SimpleResponseDto>> CreateMessage([FromBody] SupportMessageRequestDto dto)
    {
        var result = await _supportMessageService.CreateAsync(dto);
        return Ok(result);
    }

    [HttpGet("messages")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> GetMessages()
    {
        var messages = await _supportMessageService.GetAllAsync();
        return Ok(new { success = true, data = messages });
    }

    [HttpDelete("messages/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SimpleResponseDto>> DeleteMessage(Guid id)
    {
        var success = await _supportMessageService.DeleteAsync(id);
        if (!success)
        {
            return NotFound(new { success = false, message = "Message not found." });
        }
        return Ok(new SimpleResponseDto { Success = true, Message = "Message deleted successfully" });
    }
}
