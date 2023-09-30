using PetHelper.Domain;

namespace PetHelper.Persistence.Contratos;

public interface IAgendamentoPersist
{
    Task<Agendamento[]> GetAllAgendamentosByPetShopIdDataAgendamentoAsync(int petShopId, DateTime dataAgendamento);
    Task<Agendamento> GetAgendamentoByIdAsync(int agendamentoId);
}
