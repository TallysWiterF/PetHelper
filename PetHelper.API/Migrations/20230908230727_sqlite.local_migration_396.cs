using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetHelper.API.Migrations
{
    /// <inheritdoc />
    public partial class sqlitelocal_migration_396 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Complemento",
                table: "Clientes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Complemento",
                table: "Clientes");
        }
    }
}
