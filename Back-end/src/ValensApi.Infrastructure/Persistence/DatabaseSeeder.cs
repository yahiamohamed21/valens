using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ValensApi.Domain.Entities;
using ValensApi.Domain.Common;

namespace ValensApi.Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedDataAsync(ApplicationDbContext context)
    {
        // 1. Ensure Database is created and migrations are applied
        await context.Database.MigrateAsync();

        // 2. Seed Categories
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new() { Id = Guid.NewGuid(), Name = "Whey Protein", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new() { Id = Guid.NewGuid(), Name = "Pre-Workout", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new() { Id = Guid.NewGuid(), Name = "Creatine", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new() { Id = Guid.NewGuid(), Name = "Vitamins", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        var wheyCategory = await context.Categories.FirstAsync(c => c.Name == "Whey Protein");
        var preCategory = await context.Categories.FirstAsync(c => c.Name == "Pre-Workout");
        var creatineCategory = await context.Categories.FirstAsync(c => c.Name == "Creatine");

        // 3. Seed Products and Variants
        if (!await context.Products.AnyAsync())
        {
            var wheyProduct = new Product
            {
                Id = Guid.NewGuid(),
                CategoryId = wheyCategory.Id,
                CategoryName = wheyCategory.Name,
                Name = "Valens Whey Premium",
                Description = "High quality grass-fed whey protein isolate designed for optimal muscle recovery.",
                Price = 1200,
                DiscountPrice = 1080,
                Stock = 100,
                Visible = true,
                Featured = true,
                BestSeller = true,
                NewArrival = true,
                VariantType = "both",
                Sku = "VL-WHEY-PREM",
                MainImage = "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=500",
                Images = new List<string> { "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=500" },
                Ingredients = new List<string> { "Whey Protein Isolate", "Natural Cocoa Powder", "Soy Lecithin", "Sucralose" },
                Benefits = new List<string> { "25g Pure Protein per serving", "Fast digesting isolate", "Zero added sugars", "Delicious double chocolate flavor" },
                Usage = "Mix 1 scoop with 250ml of water or skimmed milk post-workout.",
                ImageType = "powder",
                ImageColor = "#FF8A75",
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            var preProduct = new Product
            {
                Id = Guid.NewGuid(),
                CategoryId = preCategory.Id,
                CategoryName = preCategory.Name,
                Name = "Valens Pre-Ignite",
                Description = "High-stimulant pre-workout formula to maximize power output, endurance, and mental focus.",
                Price = 850,
                DiscountPrice = 790,
                Stock = 50,
                Visible = true,
                Featured = true,
                BestSeller = false,
                NewArrival = true,
                VariantType = "both",
                Sku = "VL-PRE-IGN",
                MainImage = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500",
                Images = new List<string> { "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500" },
                Ingredients = new List<string> { "Beta-Alanine", "L-Citrulline Malate", "Caffeine Anhydrous", "L-Tyrosine" },
                Benefits = new List<string> { "Explosive energy boost", "Skin-splitting muscle pumps", "Enhanced mental focus", "Delay muscle fatigue" },
                Usage = "Take 1 scoop 20-30 minutes before training with cold water.",
                ImageType = "powder",
                ImageColor = "#FF5226",
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            var creatineProduct = new Product
            {
                Id = Guid.NewGuid(),
                CategoryId = creatineCategory.Id,
                CategoryName = creatineCategory.Name,
                Name = "Valens Creatine Pure",
                Description = "100% pure micronized creatine monohydrate. Increases physical performance in high-intensity exercise.",
                Price = 600,
                DiscountPrice = 0,
                Stock = 150,
                Visible = true,
                Featured = false,
                BestSeller = true,
                NewArrival = false,
                VariantType = "size",
                Sku = "VL-CRE-PURE",
                MainImage = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
                Images = new List<string> { "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500" },
                Ingredients = new List<string> { "100% Micronized Creatine Monohydrate" },
                Benefits = new List<string> { "Increases muscle strength", "Improves power output", "Hydrates muscle cells", "Unflavored for easy mixing" },
                Usage = "Take 1 serving (5g) daily. Mix into your pre/post workout shake.",
                ImageType = "powder",
                ImageColor = "#00F2FE",
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            await context.Products.AddRangeAsync(wheyProduct, preProduct, creatineProduct);
            await context.SaveChangesAsync();

            // Seed Variants
            var variants = new List<ProductVariant>
            {
                new() { Id = Guid.NewGuid(), ProductId = wheyProduct.Id, VariantId = "VL-WHEY-PREM-1", Size = "1kg", Flavor = "Double Chocolate", Price = 1200, StockQuantity = 50, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new() { Id = Guid.NewGuid(), ProductId = wheyProduct.Id, VariantId = "VL-WHEY-PREM-2", Size = "2kg", Flavor = "Vanilla Ice Cream", Price = 2200, StockQuantity = 50, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new() { Id = Guid.NewGuid(), ProductId = preProduct.Id, VariantId = "VL-PRE-IGN-1", Size = "30 Servings", Flavor = "Blue Raspberry", Price = 850, StockQuantity = 25, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new() { Id = Guid.NewGuid(), ProductId = preProduct.Id, VariantId = "VL-PRE-IGN-2", Size = "30 Servings", Flavor = "Watermelon", Price = 850, StockQuantity = 25, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new() { Id = Guid.NewGuid(), ProductId = creatineProduct.Id, VariantId = "VL-CRE-PURE-1", Size = "300g", Flavor = "Unflavored", Price = 600, StockQuantity = 75, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new() { Id = Guid.NewGuid(), ProductId = creatineProduct.Id, VariantId = "VL-CRE-PURE-2", Size = "500g", Flavor = "Unflavored", Price = 950, StockQuantity = 75, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow }
            };

            await context.ProductVariants.AddRangeAsync(variants);
            await context.SaveChangesAsync();
        }

        // 4. Seed Coupons
        if (!await context.Coupons.AnyAsync())
        {
            var coupons = new List<Coupon>
            {
                new() { Id = Guid.NewGuid(), Code = "VALENS10", DiscountType = "Percentage", DiscountValue = 10, MinOrderAmount = 500, ExpiryDate = DateTimeOffset.UtcNow.AddMonths(2), IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new() { Id = Guid.NewGuid(), Code = "FREE60", DiscountType = "Fixed", DiscountValue = 60, MinOrderAmount = 1000, ExpiryDate = DateTimeOffset.UtcNow.AddMonths(1), IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow }
            };
            await context.Coupons.AddRangeAsync(coupons);
            await context.SaveChangesAsync();
        }

        // 5. Seed Users & Customers
        var adminExists = await context.Users.AnyAsync(u => u.Role == "Admin");
        if (!adminExists)
        {
            var adminUser = new User
            {
                Id = new Guid("a7c4f4a9-83ff-410e-a4b5-90f772591605"),
                Email = "admin@valens.com",
                PasswordHash = PasswordHasher.HashPassword("Admin@Valens123!"),
                FullName = "Valens Administrator",
                Role = "Admin",
                Phone = "01000000000",
                Address = "Valens Head Office, Cairo",
                City = "Cairo",
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }

        if (await context.Users.CountAsync() <= 1) // only Admin exists
        {
            // Seed Customer Users
            var customer1 = new User
            {
                Id = Guid.NewGuid(),
                Email = "customer1@valens.com",
                PasswordHash = PasswordHasher.HashPassword("Customer123!"),
                FullName = "Ahmed Aly",
                Role = "Customer",
                Phone = "01122334455",
                Address = "90 Road, Fifth Settlement",
                City = "Cairo",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-10),
                UpdatedAt = DateTimeOffset.UtcNow.AddDays(-10)
            };

            var customer2 = new User
            {
                Id = Guid.NewGuid(),
                Email = "customer2@valens.com",
                PasswordHash = PasswordHasher.HashPassword("Customer123!"),
                FullName = "Sarah Hassan",
                Role = "Customer",
                Phone = "01234567890",
                Address = "Giza Street, Near Pyramids",
                City = "Giza",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-7),
                UpdatedAt = DateTimeOffset.UtcNow.AddDays(-7)
            };

            await context.Users.AddRangeAsync(customer1, customer2);
            await context.SaveChangesAsync();

            // Link Customer entities
            var custProfile1 = new Customer
            {
                Id = Guid.NewGuid(),
                UserId = customer1.Id,
                FullName = customer1.FullName,
                Email = customer1.Email,
                Phone = customer1.Phone,
                Address = customer1.Address,
                City = customer1.City,
                TotalOrders = 2,
                TotalSpent = 3060,
                CreatedAt = customer1.CreatedAt,
                UpdatedAt = customer1.UpdatedAt
            };

            var custProfile2 = new Customer
            {
                Id = Guid.NewGuid(),
                UserId = customer2.Id,
                FullName = customer2.FullName,
                Email = customer2.Email,
                Phone = customer2.Phone,
                Address = customer2.Address,
                City = customer2.City,
                TotalOrders = 1,
                TotalSpent = 810,
                CreatedAt = customer2.CreatedAt,
                UpdatedAt = customer2.UpdatedAt
            };

            await context.Customers.AddRangeAsync(custProfile1, custProfile2);
            await context.SaveChangesAsync();

            // Seed Orders
            var order1 = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = "VL-10001",
                CustomerId = custProfile1.Id,
                CustomerName = custProfile1.FullName,
                CustomerEmail = custProfile1.Email,
                CustomerPhone = custProfile1.Phone,
                ShippingAddress = custProfile1.Address,
                ShippingCity = custProfile1.City,
                Status = "Completed",
                PaymentMethod = "COD",
                Subtotal = 2400,
                ShippingCost = 0,
                DiscountAmount = 0,
                CouponCode = "",
                Total = 2400,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-5),
                UpdatedAt = DateTimeOffset.UtcNow.AddDays(-5)
            };

            var order2 = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = "VL-10002",
                CustomerId = custProfile1.Id,
                CustomerName = custProfile1.FullName,
                CustomerEmail = custProfile1.Email,
                CustomerPhone = custProfile1.Phone,
                ShippingAddress = custProfile1.Address,
                ShippingCity = custProfile1.City,
                Status = "Pending",
                PaymentMethod = "COD",
                Subtotal = 600,
                ShippingCost = 60,
                DiscountAmount = 0,
                CouponCode = "",
                Total = 660,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-1),
                UpdatedAt = DateTimeOffset.UtcNow.AddDays(-1)
            };

            var order3 = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = "VL-10003",
                CustomerId = custProfile2.Id,
                CustomerName = custProfile2.FullName,
                CustomerEmail = custProfile2.Email,
                CustomerPhone = custProfile2.Phone,
                ShippingAddress = custProfile2.Address,
                ShippingCity = custProfile2.City,
                Status = "Confirmed",
                PaymentMethod = "COD",
                Subtotal = 850,
                ShippingCost = 60,
                DiscountAmount = 100,
                CouponCode = "VALENS10",
                Total = 810,
                CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-30),
                UpdatedAt = DateTimeOffset.UtcNow.AddMinutes(-30)
            };

            await context.Orders.AddRangeAsync(order1, order2, order3);
            await context.SaveChangesAsync();
        }

        // 6. Seed Expenses
        if (!await context.Expenses.AnyAsync())
        {
            var expenses = new List<Expense>
            {
                new() { Id = Guid.NewGuid(), Title = "Gym Sponsorship Promo", Amount = 500, Category = "Marketing", Date = DateTimeOffset.UtcNow.AddDays(-10), CreatedAt = DateTimeOffset.UtcNow.AddDays(-10), UpdatedAt = DateTimeOffset.UtcNow.AddDays(-10) },
                new() { Id = Guid.NewGuid(), Title = "Courier Delivery Settlement", Amount = 120, Category = "Shipping", Date = DateTimeOffset.UtcNow.AddDays(-3), CreatedAt = DateTimeOffset.UtcNow.AddDays(-3), UpdatedAt = DateTimeOffset.UtcNow.AddDays(-3) }
            };
            await context.Expenses.AddRangeAsync(expenses);
            await context.SaveChangesAsync();
        }
    }
}
