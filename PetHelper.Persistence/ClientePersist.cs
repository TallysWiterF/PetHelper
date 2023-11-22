using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;
using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;
namespace PetHelper.Persistence;

public class ClientePersist : IClientePersist
{
    private readonly PetHelperContext _context;

    public ClientePersist(PetHelperContext context)
    {
        _context = context;
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    public async Task<Cliente[]> GetAllClientesByPetShopIdAsync(int petShopId) => await _context.Clientes.Where(p => p.PetShopId == petShopId)
                                                                                                         .OrderBy(p => p.Nome)
                                                                                                         .ToArrayAsync();

    public async Task<Cliente?> GetClienteByIdAsync(int clienteId) => await _context.Clientes.Where(p => p.Id == clienteId)
                                                                                             .FirstOrDefaultAsync();
    public async Task<Cliente?> GetClienteByNomeTelefoneAsync(string nome, string telefone) => await _context.Clientes.Where(p => p.Nome.ToLower().Equals(nome.ToLower()) && p.Telefone.Equals(telefone))
                                                                                                                      .FirstOrDefaultAsync();
    public async Task<Cliente?> GetClienteByPetShopIdTelefoneAsync(int petShopId, string telefone) => await _context.Clientes.Where(p => p.PetShopId == petShopId && p.Telefone.Equals(telefone))
                                                                                                                             .FirstOrDefaultAsync();
}
