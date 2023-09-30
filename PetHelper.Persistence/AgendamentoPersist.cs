using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;
using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Persistence;

public class AgendamentoPersist : IAgendamentoPersist
{
    private readonly PetHelperContext _context;

    public AgendamentoPersist(PetHelperContext context)
    {
        _context = context;
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    public async Task<Agendamento?> GetAgendamentoByIdAsync(int agendamentoId)
    {
        IQueryable<Agendamento> query = _context.Agendamentos;

        query = query.Where(p => p.AgendamentoId == agendamentoId).
                      OrderBy(p => p.DataAgendamento);

        return await query.FirstOrDefaultAsync();
    }

    public async Task<Agendamento[]> GetAllAgendamentosByPetShopIdDataAgendamentoAsync(int petShopId, DateTime dataAgendamento)
    {
        IQueryable<Agendamento> query = _context.Agendamentos;

        query = query.Where(p => p.PetShopId == petShopId && p.DataAgendamento == dataAgendamento).
                      OrderBy(p => p.DataAgendamento);

        return await query.ToArrayAsync();
    }
}
