using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValensApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStoreSettingsAndProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HomepageDiscountBannerText",
                table: "StoreSettings",
                newName: "SocialTwitter");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BrandName",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstBannerCtaText",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstBannerCtaTextAr",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstBannerSubtitle",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstBannerSubtitleAr",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstBannerTitle",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstBannerTitleAr",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeroCtaLink",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroCtaText",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroCtaTextAr",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeroSubtitleAr",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeroTitleAr",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LogoText",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PromoBadge",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PromoBadgeAr",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SocialFacebook",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SocialInstagram",
                table: "StoreSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "TaxRate",
                table: "StoreSettings",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Products",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingMethod",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageColor",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Author = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "StoreSettings",
                keyColumn: "Id",
                keyValue: new Guid("4673bb03-cb84-4824-a745-f09205ea6857"),
                columns: new[] { "Address", "BrandName", "FirstBannerCtaText", "FirstBannerCtaTextAr", "FirstBannerSubtitle", "FirstBannerSubtitleAr", "FirstBannerTitle", "FirstBannerTitleAr", "HeroCtaLink", "HeroCtaText", "HeroCtaTextAr", "HeroSubtitleAr", "HeroTitleAr", "LogoText", "PromoBadge", "PromoBadgeAr", "SocialFacebook", "SocialInstagram", "SocialTwitter", "TaxRate" },
                values: new object[] { "88 Science & Athletics Drive, Sector 4, CA 90210", "VALENS", "DISCOVER THE SCIENCE", "اكتشف الجانب العلمي", "Cold-filtered processing, zero artificial coloring, complete transparency. We don't hide behind proprietary blends. What you see is exactly what powers you.", "معالجة بالفلترة الباردة، خالية تمامًا من الألوان الاصطناعية، وشفافية مطلقة للبطاقات. لا نختبئ خلف تركيبات احتكارية مبهمة.", "THE VALENS FORMULA", "تركيبة VALENS النخبوية", "/products", "SHOP THE NUTRITION", "تسوق التغذية الفاخرة", "مُهندس خصيصاً للرياضيين النخبة. مكملات فاخرة مُصممة بجرعات سريرية ومكونات نظيفة وبدون تنازلات.", "مُصمم برؤية علمية، مُنفجر بقوة الأداء", "VALENS", "ELITE PERFORMANCE LINE", "خط الأداء الرياضي الفاخر", "valens.elite", "@valens_nutrition", "@valens_performance", 5m });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ProductId",
                table: "Reviews",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "BrandName",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "FirstBannerCtaText",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "FirstBannerCtaTextAr",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "FirstBannerSubtitle",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "FirstBannerSubtitleAr",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "FirstBannerTitle",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "FirstBannerTitleAr",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "HeroCtaLink",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "HeroCtaText",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "HeroCtaTextAr",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "HeroSubtitleAr",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "HeroTitleAr",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "LogoText",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "PromoBadge",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "PromoBadgeAr",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "SocialFacebook",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "SocialInstagram",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "TaxRate",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ShippingMethod",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ImageColor",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Categories");

            migrationBuilder.RenameColumn(
                name: "SocialTwitter",
                table: "StoreSettings",
                newName: "HomepageDiscountBannerText");

            migrationBuilder.UpdateData(
                table: "StoreSettings",
                keyColumn: "Id",
                keyValue: new Guid("4673bb03-cb84-4824-a745-f09205ea6857"),
                column: "HomepageDiscountBannerText",
                value: "Get 10% off your first order! Use code: FIRST10");
        }
    }
}
