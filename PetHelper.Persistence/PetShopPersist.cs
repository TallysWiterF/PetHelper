using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;
using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;
using BCryptNet = BCrypt.Net.BCrypt;

namespace PetHelper.Persistence;

public class PetShopPersist : IPetShopPersist
{
    private readonly PetHelperContext _context;

    public PetShopPersist(PetHelperContext context)
    {
        _context = context;
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    public async Task<PetShop?> GetPetShopByIdAsync(int petShopId) => await _context.PetShops.Where(p => p.Id == petShopId)
                                                                                             .FirstOrDefaultAsync();

    public async Task<PetShop?> GetPetShopByEmailSenha(string email, string senha)
    {
        PetShop? petShop = await _context.PetShops
                                         .Where(p => p.Email == email)
                                         .FirstOrDefaultAsync();

        if (petShop != null && BCryptNet.Verify(senha, petShop.Senha))
            return petShop;

        return null;
    }

    public async Task<bool> ValidarEmailJaCadastrado(string email) => await _context.PetShops.Where(p => p.Email == email).FirstOrDefaultAsync() != null;
}
