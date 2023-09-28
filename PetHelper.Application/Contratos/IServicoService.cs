using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application.Contratos;

public interface IServicoService : IServicoPersist
{
    Task<bool> AddServico(Servico servicoModel);
    Task<bool> UpdateServico(Servico servicoModel);
    Task<bool> DeleteServicoById(int servicoId);
}
