using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValensApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddArabicProductFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BenefitsAr",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionAr",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IngredientsAr",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UsageAr",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BenefitsAr",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DescriptionAr",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IngredientsAr",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "UsageAr",
                table: "Products");
        }
    }
}
