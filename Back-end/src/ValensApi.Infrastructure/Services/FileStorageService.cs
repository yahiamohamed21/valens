using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.Interfaces;

namespace ValensApi.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
    private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif" };
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

    public async Task<string> SaveFileAsync(IFormFile file, string folderName = "uploads")
    {
        if (file == null || file.Length == 0)
        {
            return string.Empty;
        }

        string extension = Path.GetExtension(file.FileName).ToLower();
        string fileName = Guid.NewGuid().ToString() + extension;
        
        string targetFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderName);
        if (!Directory.Exists(targetFolder))
        {
            Directory.CreateDirectory(targetFolder);
        }

        string filePath = Path.Combine(targetFolder, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"/{folderName}/{fileName}";
    }

    public void DeleteFile(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl)) return;

        // Ensure we only delete local uploads, not external URLs starting with http
        if (fileUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase)) return;

        try
        {
            // Normalize path separator
            string relativePath = fileUrl.TrimStart('/');
            string absolutePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath.Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(absolutePath))
            {
                File.Delete(absolutePath);
            }
        }
        catch
        {
        }
    }

    public bool IsValidImage(IFormFile file, out string errorMessage)
    {
        errorMessage = string.Empty;

        if (file == null || file.Length == 0)
        {
            errorMessage = "No file uploaded or file is empty.";
            return false;
        }

        if (file.Length > MaxFileSizeBytes)
        {
            errorMessage = $"File size exceeds the limit of {MaxFileSizeBytes / (1024 * 1024)}MB.";
            return false;
        }

        string extension = Path.GetExtension(file.FileName).ToLower();
        if (!AllowedExtensions.Contains(extension))
        {
            errorMessage = $"File type {extension} is not allowed. Allowed types are: {string.Join(", ", AllowedExtensions)}";
            return false;
        }

        string contentType = file.ContentType.ToLower();
        if (!AllowedMimeTypes.Contains(contentType))
        {
            errorMessage = $"MIME type {contentType} is not allowed. Allowed MIME types are: {string.Join(", ", AllowedMimeTypes)}";
            return false;
        }

        return true;
    }
}
