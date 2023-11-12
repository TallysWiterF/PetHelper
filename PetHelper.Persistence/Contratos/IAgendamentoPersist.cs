using PetHelper.Domain;

namespace PetHelper.Persistence.Contratos;

public interface IAgendamentoPersist
{
    Task<Agendamento[]> GetAllAgendamentosByPetShopIdDataAgendamentoAsync(int petShopId, DateTime dataAgendamento);
    Task<Agendamento?> GetAgendamentoByIdAsync(int agendamentoId);
    Task<int[]> GetAllDiasComAgendamentosByPetShopIdMesAsync(int petShopId, int mes);
    Task<string[]> GetAllHorariosDisponiveisByPetShopIdDataAgendamentoAsync(int petShopId, DateTime dataAgendamento);
    Informativo GetInformativosPetShop(int petShopId, DateTime dataAgendamento);
}
