using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;
using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Persistence;

public class ServicoPersist : IServicoPersist
{
    private readonly PetHelperContext _context;

    public ServicoPersist(PetHelperContext context)
    {
        _context = context;
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    public async Task<Servico[]> GetAllServicosByPetShopIdAsync(int petShopId)
    {
        IQueryable<Servico> query = _context.Servicos;

        query = query.Where(p => p.PetShopId == petShopId);
        query = query.OrderByDescending(p => p.DataAtualizacao);

        return await query.ToArrayAsync();
    }

    public async Task<Servico> GetServicoByIdAsync(int servicoId)
    {
        IQueryable<Servico> query = _context.Servicos;

        query = query.Where(p => p.Id == servicoId);

        return await query.FirstOrDefaultAsync();
    }
}
