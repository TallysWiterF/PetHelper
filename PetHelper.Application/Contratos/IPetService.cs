using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application.Contratos
{
    public interface IPetService : IPetPersist
    {
        Task<bool> UpdatePet(Pet pet);
        Task<bool> DeletePetById(int petId);
    }
}
