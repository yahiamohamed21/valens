using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValensApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHomeControlTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HomeBanners",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DesktopImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    MobileImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CtaText = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CtaLink = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    AltText = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeBanners", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HomeSectionProducts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SectionKey = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeSectionProducts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HomeSectionProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HomeStories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Link = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    AltText = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeStories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HomeBanners_DisplayOrder",
                table: "HomeBanners",
                column: "DisplayOrder");

            migrationBuilder.CreateIndex(
                name: "IX_HomeBanners_IsActive",
                table: "HomeBanners",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_HomeSectionProducts_DisplayOrder",
                table: "HomeSectionProducts",
                column: "DisplayOrder");

            migrationBuilder.CreateIndex(
                name: "IX_HomeSectionProducts_IsActive",
                table: "HomeSectionProducts",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_HomeSectionProducts_ProductId",
                table: "HomeSectionProducts",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_HomeSectionProducts_SectionKey",
                table: "HomeSectionProducts",
                column: "SectionKey");

            migrationBuilder.CreateIndex(
                name: "IX_HomeSectionProducts_SectionKey_ProductId",
                table: "HomeSectionProducts",
                columns: new[] { "SectionKey", "ProductId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HomeStories_DisplayOrder",
                table: "HomeStories",
                column: "DisplayOrder");

            migrationBuilder.CreateIndex(
                name: "IX_HomeStories_IsActive",
                table: "HomeStories",
                column: "IsActive");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HomeBanners");

            migrationBuilder.DropTable(
                name: "HomeSectionProducts");

            migrationBuilder.DropTable(
                name: "HomeStories");
        }
    }
}
