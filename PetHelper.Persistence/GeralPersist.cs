using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;
using System.Reflection;

namespace PetHelper.Persistence;

public class GeralPersist : IGeralPersist
{
    private readonly PetHelperContext _context;

    public GeralPersist(PetHelperContext context) => _context = context;
    public void Add<T>(T entity) where T : class => _context.Add(TrimProperties(entity));
    public void Update<T>(T entity) where T : class => _context.Update(TrimProperties(entity));
    public void Delete<T>(T entity) where T : class => _context.Remove(entity);
    public void DeleteRange<T>(T[] entityArray) where T : class => _context.RemoveRange(entityArray);
    public async Task<bool> SaveChangesAsync() => (await _context.SaveChangesAsync()) > 0;

    private static object TrimProperties(object obj)
    {
        Type type = obj.GetType();
        PropertyInfo[] properties = type.GetProperties();

        foreach (PropertyInfo property in properties)
        {
            if (property.PropertyType == typeof(string))
            {
                string? currentValue = property?.GetValue(obj, null) as string;
                if (!string.IsNullOrEmpty(currentValue))
                {
                    string trimmedValue = currentValue.TrimEnd();
                    property?.SetValue(obj, trimmedValue, null);
                }
            }
        }

        return obj;
    }

}
