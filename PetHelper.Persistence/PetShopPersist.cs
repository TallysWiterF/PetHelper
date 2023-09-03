using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;
using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Persistence;

public class PetShopPersist : IPetShopPersist
{
    private readonly PetHelperContext _context;

    public PetShopPersist(PetHelperContext context)
    {
        _context = context;
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    public async Task<PetShop> GetPetShopByIdAsync(int petShopId)
    {
        IQueryable<PetShop> query = _context.PetShops;
         
        query = query.Where(p => p.Id == petShopId);

        return await query.FirstOrDefaultAsync(); 
    }
}
