using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace ValensApi.Application.Interfaces;

public interface IFileStorageService
{
    
    Task<string> SaveFileAsync(IFormFile file, string folderName = "uploads");

   
    void DeleteFile(string fileUrl);

 
    bool IsValidImage(IFormFile file, out string errorMessage);
}
