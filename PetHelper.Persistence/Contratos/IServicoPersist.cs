using PetHelper.Domain;

namespace PetHelper.Persistence.Contratos;

public interface IServicoPersist
{
    Task<Servico[]> GetAllServicosByPetShopIdAsync(int petShopId, bool retornarLogoServico);
    Task<Servico[]> GetAllServicosAtivosByPetShopIdAsync(int petShopId, bool ativo);
    Task<Servico> GetServicoByIdAsync(int servicoId);
}
