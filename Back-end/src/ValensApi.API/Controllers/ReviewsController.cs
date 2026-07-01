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
    [Authorize]
    public async Task<IActionResult> AddReview(Guid productId, [FromBody] CreateReviewDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var product = await _unitOfWork.Products.GetQueryable()
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
            return NotFound("Product not found.");

        var tokenEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value?.Trim().ToLower();
        if (string.IsNullOrEmpty(tokenEmail))
        {
            return Unauthorized("You must be logged in to rate or review / يجب عليك تسجيل الدخول أولاً للتقييم");
        }

        var customerEmail = tokenEmail;
        
        // Verify the customer has purchased this product
        var hasPurchased = await _unitOfWork.Orders.GetQueryable()
            .AnyAsync(o => o.CustomerEmail.ToLower() == customerEmail
                      && o.Status != "CANCELLED"
                      && o.Status != "REJECTED"
                      && o.Items.Any(i => i.ProductId == productId));

        if (!hasPurchased)
        {
            // Verify if there is any order at all, but return bilingual error
            return BadRequest("You can only review or rate products you have purchased / يمكنك فقط تقييم المنتجات التي قمت بشرائها بالفعل");
        }

        // Check if the user has already rated this product (rating > 0)
        var hasAlreadyRated = await _unitOfWork.ProductReviews.GetQueryable()
            .AnyAsync(r => r.ProductId == productId && r.CustomerEmail.ToLower() == customerEmail && r.Rating > 0);

        int finalRating = dto.Rating;
        string commentText = dto.Comment?.Trim() ?? string.Empty;

        if (hasAlreadyRated)
        {
            // If they already rated, and they are submitting an empty rating (direct rating)
            if (string.IsNullOrEmpty(commentText))
            {
                return BadRequest("You have already rated this product / لقد قمت بتقييم هذا المنتج بالفعل");
            }
            // Allow comment but discard rating for subsequent comments
            finalRating = 0;
        }

        var review = new ProductReview
        {
            ProductId = productId,
            CustomerName = dto.CustomerName.Trim(),
            CustomerEmail = customerEmail,
            Rating = finalRating,
            Comment = commentText,
            IsApproved = true // default approved
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
