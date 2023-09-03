using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Persistence;

public class GeralPersist : IGeralPersist
{
    private readonly PetHelperContext _context;

    public GeralPersist(PetHelperContext context) => _context = context;
    public void Add<T>(T entity) where T : class => _context.Add(entity);
    public void Update<T>(T entity) where T : class => _context.Update(entity);
    public void Delete<T>(T entity) where T : class => _context.Remove(entity);
    public void DeleteRange<T>(T[] entityArray) where T : class => _context.RemoveRange(entityArray);
    public async Task<bool> SaveChangesAsync() => (await _context.SaveChangesAsync()) > 0;
}
