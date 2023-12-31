﻿using PetHelper.Domain;

namespace PetHelper.Persistence.Contratos;

public interface IClientePersist
{
    Task<Cliente[]> GetAllClientesByPetShopIdAsync(int petShopId);
    Task<Cliente?> GetClienteByIdAsync(int clienteId);
    Task<Cliente?> GetClienteByNomeTelefoneAsync(string nome, string telefone);
    Task<Cliente?> GetClienteByPetShopIdTelefoneAsync(int petShopId,  string telefone);
}
