using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application.Contratos;

public interface IAgendamentoService : IAgendamentoPersist
{
    Task<bool> AddAgendamento(Agendamento agendamentoModel);
    Task<bool> UpdateAgendamento(Agendamento agendamentoModel);
    Task<bool> DeleteAgendamentoById(int agendamentoId);
}
