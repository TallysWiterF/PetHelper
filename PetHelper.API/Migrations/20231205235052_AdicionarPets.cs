using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetHelper.API.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarPets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PetShopId = table.Column<int>(type: "INTEGER", nullable: false),
                    ClienteId = table.Column<int>(type: "INTEGER", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Raca = table.Column<int>(type: "INTEGER", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pets_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pets_ClienteId",
                table: "Pets",
                column: "ClienteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pets");
        }
    }
}
