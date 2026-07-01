using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValensApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixModelPending : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("a7c4f4a9-83ff-410e-a4b5-90f772591605"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "City", "CreatedAt", "Email", "FullName", "PasswordHash", "Phone", "RefreshToken", "RefreshTokenExpiryTime", "Role", "UpdatedAt" },
                values: new object[] { new Guid("a7c4f4a9-83ff-410e-a4b5-90f772591605"), "Valens Head Office, Cairo", "Cairo", new DateTimeOffset(new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "admin@valens.com", "Valens Administrator", "fP1pSgpCP7+bxl1QxkIqDZHmkJT1VaCCCescwC9lIyc2AQ5oYHbwYngiRV3thFIo", "01000000000", null, null, "Admin", new DateTimeOffset(new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)) });
        }
    }
}
