using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;

namespace ValensApi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected Guid CurrentUserId
    {
        get
        {
            var idString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(idString, out var guid) ? guid : Guid.Empty;
        }
    }
}
