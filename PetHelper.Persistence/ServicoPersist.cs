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

    public async Task<Servico[]> GetAllServicosByPetShopIdAsync(int petShopId, bool retornarLogoServico)
    {
        IQueryable<Servico> query = _context.Servicos;

        if (retornarLogoServico)
        {
            return await query.Where(p => p.PetShopId == petShopId)
                              .OrderBy(p => p.Nome)
                              .ToArrayAsync();
        }
        else
        {
            return await query.Where(p => p.PetShopId == petShopId)
                              .OrderBy(p => p.Nome)
                              .Select(p => new Servico
                              {
                                  Id = p.Id,
                                  PetShopId = p.PetShopId,
                                  Nome = p.Nome,
                                  Descricao = p.Descricao,
                                  Preco = p.Preco,
                                  Ativo = p.Ativo,
                                  DataCriacao = p.DataCriacao,
                                  DataAtualizacao = p.DataAtualizacao,
                              })
                              .ToArrayAsync();
        }
    }

    public async Task<Servico> GetServicoByIdAsync(int servicoId)
    {
        IQueryable<Servico> query = _context.Servicos;

        return await query.Where(p => p.Id == servicoId)
                          .FirstOrDefaultAsync();
    }
}
