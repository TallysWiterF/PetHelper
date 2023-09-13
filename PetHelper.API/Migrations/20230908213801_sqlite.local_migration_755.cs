using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetHelper.API.Migrations
{
    /// <inheritdoc />
    public partial class sqlitelocal_migration_755 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_PetShops_PetShopId",
                table: "Clientes");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_PetShopId",
                table: "Clientes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Clientes_PetShopId",
                table: "Clientes",
                column: "PetShopId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_PetShops_PetShopId",
                table: "Clientes",
                column: "PetShopId",
                principalTable: "PetShops",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
