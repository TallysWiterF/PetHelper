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
        if (retornarLogoServico)
            return await _context.Servicos.Where(p => p.PetShopId == petShopId)
                              .OrderBy(p => p.Nome)
                              .ToArrayAsync();

            return await _context.Servicos.Where(p => p.PetShopId == petShopId)
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

    public async Task<Servico[]> GetAllServicosAtivosByPetShopIdAsync(int petShopId, bool ativo) => await _context.Servicos.Where(p => p.PetShopId == petShopId
                                                                                                                                    && p.Ativo == ativo)
                                                                                                                           .OrderBy(p => p.Nome)
                                                                                                                           .ToArrayAsync();

    public async Task<Servico> GetServicoByIdAsync(int servicoId) => await _context.Servicos.Where(p => p.Id == servicoId)
                                                                                            .FirstOrDefaultAsync();
}
