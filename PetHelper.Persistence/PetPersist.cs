using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;
using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Persistence
{
    public class PetPersist : IPetPersist
    {
        private readonly PetHelperContext _context;

        public PetPersist(PetHelperContext context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public async Task<Pet?> GetPetByIdAsync(int petId) => await _context.Pets.Where(p => p.Id == petId)
                                                                                 .FirstOrDefaultAsync();

    }
}
