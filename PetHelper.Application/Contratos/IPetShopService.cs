using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application.Contratos;

public interface IPetShopService : IPetShopPersist
{
    Task<PetShop?> AddPetShop(PetShop petShopModel);
    Task<PetShop?> UpdatePetShop(int petShopId, PetShop petShopModel);
    Task<bool> DeletePetShop(int petShopId);
}
