using PetHelper.Domain;

namespace PetHelper.Persistence.Contratos;

public interface IPetShopPersist
{
    Task<PetShop?> GetPetShopByIdAsync(int petShopId);
    Task<PetShop?> GetPetShopByEmailSenha(string email, string senha);
    Task<bool> ValidarEmailJaCadastrado(string email);
}
