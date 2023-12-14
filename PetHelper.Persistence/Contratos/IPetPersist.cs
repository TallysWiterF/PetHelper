using PetHelper.Domain;

namespace PetHelper.Persistence.Contratos;

public interface IPetPersist
{
    Task<Pet?> GetPetByIdAsync(int petId);
}
