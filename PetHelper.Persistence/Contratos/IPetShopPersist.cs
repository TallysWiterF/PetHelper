using PetHelper.Domain;

namespace PetHelper.Persistence.Contratos;

public interface IPetShopPersist
{
    Task<PetShop> GetPetShopByIdAsync(int petShopId);
}
