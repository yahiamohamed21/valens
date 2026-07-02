using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValensApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRefreshTokenFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "RefreshTokenExpiryTime",
                table: "Users",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("a7c4f4a9-83ff-410e-a4b5-90f772591605"),
                columns: new[] { "RefreshToken", "RefreshTokenExpiryTime" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "Users");
        }
    }
}
