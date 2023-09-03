using PetHelper.Application.Contratos;
using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application;

public class PetShopService : IPetShopService
{
    private readonly IGeralPersist _geralPersist;
    private readonly IPetShopPersist _petShopPersist;

    public PetShopService(IGeralPersist geralPersist, IPetShopPersist petShopPersist)
    {
        _geralPersist = geralPersist;
        _petShopPersist = petShopPersist;
    }

    public async Task<PetShop?> AddPetShop(PetShop petShopModel)
    {
        try
        {
            _geralPersist.Add(petShopModel);
            if (await _geralPersist.SaveChangesAsync())
                return await _petShopPersist.GetPetShopByIdAsync(petShopModel.Id);

            return null;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<PetShop?> UpdatePetShop(int petShopId, PetShop model)
    {
        try
        {
            PetShop petShop = await _petShopPersist.GetPetShopByIdAsync(petShopId);
            if (petShop != null)
            {
                model.Id = petShop.Id;

                _geralPersist.Update(model);
                if (await _geralPersist.SaveChangesAsync())
                    return await _petShopPersist.GetPetShopByIdAsync(model.Id);
            }

            return null;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }        
    }

    public async Task<bool> DeletePetShop(int petShopId)
    {
        try
        {
            PetShop petShop = await _petShopPersist.GetPetShopByIdAsync(petShopId);
            if (petShop is null)
                throw new Exception("PetShop não encontrada");

            _geralPersist.Delete(petShop);
            return await _geralPersist.SaveChangesAsync();

        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<PetShop?> GetPetShopByIdAsync(int petShopId)
    {
        try
        {
            PetShop? petShop = await _petShopPersist.GetPetShopByIdAsync(petShopId);

            return petShop;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}