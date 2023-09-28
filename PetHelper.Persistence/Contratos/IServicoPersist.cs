using PetHelper.Domain;

namespace PetHelper.Persistence.Contratos;

public interface IServicoPersist
{
    Task<Servico[]> GetAllServicosByPetShopIdAsync(int petShopId);
    Task<Servico> GetServicoByIdAsync(int servicoId);
}
