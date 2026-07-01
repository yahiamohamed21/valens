using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using ValensApi.Application.Interfaces;

namespace ValensApi.API.Controllers;

[ApiController]
[Route("api/admin/uploads")]
public class UploadsController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UploadsController(IFileStorageService fileStorageService, IHttpContextAccessor httpContextAccessor)
    {
        _fileStorageService = fileStorageService;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] string folder = "home")
    {
        if (!_fileStorageService.IsValidImage(file, out var errorMessage))
        {
            return BadRequest(new { success = false, message = errorMessage });
        }

        if (string.IsNullOrEmpty(folder))
        {
            folder = "home";
        }
        else
        {
            folder = string.Concat(folder.Split(Path.GetInvalidFileNameChars()));
        }

        var savedPath = await _fileStorageService.SaveFileAsync(file, folder);
        
        var request = _httpContextAccessor.HttpContext?.Request;
        string absoluteUrl = savedPath;
        if (request != null)
        {
            var baseUrl = $"{request.Scheme}://{request.Host}";
            absoluteUrl = baseUrl + (savedPath.StartsWith('/') ? savedPath : "/" + savedPath);
        }

        return Ok(new
        {
            success = true,
            data = new
            {
                url = absoluteUrl,
                filename = Path.GetFileName(savedPath),
                mime_type = file.ContentType,
                size = file.Length
            }
        });
    }
}
