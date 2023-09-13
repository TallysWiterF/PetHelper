using PetHelper.Domain;

namespace PetHelper.Persistence.Contratos;

public interface IClientePersist
{
    Task<Cliente[]> GetAllClientesByPetShopIdAsync(int petShopId);
    Task<Cliente> GetClienteByIdAsync(int clienteId);
}
