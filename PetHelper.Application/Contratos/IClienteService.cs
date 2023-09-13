using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application.Contratos;

public interface IClienteService : IClientePersist
{
    Task<bool> AddCliente(Cliente clienteModel);
    Task<bool> UpdateCliente(Cliente clienteModel);
    Task<bool> DeleteClienteById(int clienteId);
}