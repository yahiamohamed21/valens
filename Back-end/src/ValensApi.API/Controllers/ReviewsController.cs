using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Products;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.API.Controllers;

public class ReviewsController : BaseApiController
{
    private readonly IUnitOfWork _unitOfWork;

    public ReviewsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpPost("products/{productId:guid}")]
    public async Task<IActionResult> AddReview(Guid productId, [FromBody] CreateReviewDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var product = await _unitOfWork.Products.GetQueryable()
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
            return NotFound("Product not found.");

        var customerEmail = dto.CustomerEmail.Trim().ToLower();
        
        // Verify the customer has purchased this product
        var hasPurchased = await _unitOfWork.Orders.GetQueryable()
            .AnyAsync(o => o.CustomerEmail.ToLower() == customerEmail
                      && o.Status != "CANCELLED"
                      && o.Status != "REJECTED"
                      && o.Items.Any(i => i.ProductId == productId));

        if (!hasPurchased)
        {
            return BadRequest("You can only review or rate products you have purchased / يمكنك فقط تقييم المنتجات التي قمت بشرائها بالفعل");
        }

        var review = new ProductReview
        {
            ProductId = productId,
            CustomerName = dto.CustomerName.Trim(),
            CustomerEmail = customerEmail,
            Rating = dto.Rating,
            Comment = dto.Comment?.Trim() ?? string.Empty,
            IsApproved = true // default approved, can be moderated in admin
        };

        await _unitOfWork.ProductReviews.AddAsync(review);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { success = true, data = review });
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetReviewsAdmin()
    {
        var reviews = await _unitOfWork.ProductReviews.GetQueryable()
            .Include(r => r.Product)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var result = reviews.Select(r => new
        {
            r.Id,
            r.ProductId,
            ProductName = r.Product?.Name ?? "Unknown Product",
            r.CustomerName,
            r.CustomerEmail,
            r.Rating,
            r.Comment,
            r.IsApproved,
            CreatedAt = r.CreatedAt
        });

        return Ok(new { success = true, data = result });
    }

    [HttpPatch("admin/{id:guid}/toggle-approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleApprove(Guid id)
    {
        var review = await _unitOfWork.ProductReviews.GetQueryable()
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
            return NotFound("Review not found.");

        review.IsApproved = !review.IsApproved;
        _unitOfWork.ProductReviews.Update(review);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { success = true, data = review });
    }

    [HttpDelete("admin/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var review = await _unitOfWork.ProductReviews.GetQueryable()
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
            return NotFound("Review not found.");

        _unitOfWork.ProductReviews.Delete(review);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { success = true, message = "Review deleted successfully" });
    }
}
