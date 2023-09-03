CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;

CREATE TABLE "PetShops" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_PetShops" PRIMARY KEY AUTOINCREMENT,
    "Nome" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Endereço" TEXT NOT NULL,
    "FotoPrincipal" TEXT NOT NULL,
    "Logo" TEXT NOT NULL,
    "Ativo" INTEGER NOT NULL,
    "DataCriacao" TEXT NOT NULL,
    "DataAtualizacao" TEXT NOT NULL
);

CREATE TABLE "Agendas" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Agendas" PRIMARY KEY AUTOINCREMENT,
    "PetShopId" INTEGER NOT NULL,
    "Horario" TEXT NOT NULL,
    "DiaSemana" INTEGER NOT NULL,
    "Ativo" INTEGER NOT NULL,
    "DataCriacao" TEXT NOT NULL,
    "DataAtualizacao" TEXT NOT NULL,
    CONSTRAINT "FK_Agendas_PetShops_PetShopId" FOREIGN KEY ("PetShopId") REFERENCES "PetShops" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Clientes" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Clientes" PRIMARY KEY AUTOINCREMENT,
    "PetShopId" INTEGER NOT NULL,
    "Nome" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Endereco" TEXT NOT NULL,
    "DataCriacao" TEXT NOT NULL,
    "DataAtualizacao" TEXT NOT NULL,
    CONSTRAINT "FK_Clientes_PetShops_PetShopId" FOREIGN KEY ("PetShopId") REFERENCES "PetShops" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Servicos" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Servicos" PRIMARY KEY AUTOINCREMENT,
    "PetShopId" INTEGER NOT NULL,
    "Nome" TEXT NOT NULL,
    "Preco" TEXT NOT NULL,
    "LogoServico" BLOB NULL,
    "Ativo" INTEGER NOT NULL,
    "DataCriacao" TEXT NOT NULL,
    "DataAtualizacao" TEXT NOT NULL,
    CONSTRAINT "FK_Servicos_PetShops_PetShopId" FOREIGN KEY ("PetShopId") REFERENCES "PetShops" ("Id") ON DELETE CASCADE
);

CREATE TABLE "OrdemServicos" (
    "PetShopId" INTEGER NOT NULL,
    "ClienteId" INTEGER NOT NULL,
    "ServicoId" INTEGER NOT NULL,
    "DataAgendamento" TEXT NOT NULL,
    "DataCriacao" TEXT NOT NULL,
    "DataAtualizacao" TEXT NOT NULL,
    CONSTRAINT "PK_OrdemServicos" PRIMARY KEY ("PetShopId", "ClienteId", "ServicoId"),
    CONSTRAINT "FK_OrdemServicos_Clientes_ClienteId" FOREIGN KEY ("ClienteId") REFERENCES "Clientes" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_OrdemServicos_PetShops_PetShopId" FOREIGN KEY ("PetShopId") REFERENCES "PetShops" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_OrdemServicos_Servicos_ServicoId" FOREIGN KEY ("ServicoId") REFERENCES "Servicos" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Agendas_PetShopId" ON "Agendas" ("PetShopId");

CREATE INDEX "IX_Clientes_PetShopId" ON "Clientes" ("PetShopId");

CREATE INDEX "IX_OrdemServicos_ClienteId" ON "OrdemServicos" ("ClienteId");

CREATE INDEX "IX_OrdemServicos_ServicoId" ON "OrdemServicos" ("ServicoId");

CREATE INDEX "IX_Servicos_PetShopId" ON "Servicos" ("PetShopId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230902165946_sqlite.local_migration_697', '7.0.8');

COMMIT;

