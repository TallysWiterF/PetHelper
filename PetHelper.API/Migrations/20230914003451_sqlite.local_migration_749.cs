using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetHelper.API.Migrations
{
    /// <inheritdoc />
    public partial class sqlitelocal_migration_749 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Servicos_PetShops_PetShopId",
                table: "Servicos");

            migrationBuilder.DropIndex(
                name: "IX_Servicos_PetShopId",
                table: "Servicos");

            migrationBuilder.AddColumn<string>(
                name: "Descricao",
                table: "Servicos",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descricao",
                table: "Servicos");

            migrationBuilder.CreateIndex(
                name: "IX_Servicos_PetShopId",
                table: "Servicos",
                column: "PetShopId");

            migrationBuilder.AddForeignKey(
                name: "FK_Servicos_PetShops_PetShopId",
                table: "Servicos",
                column: "PetShopId",
                principalTable: "PetShops",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
