using PetHelper.Application.Contratos;
using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application;

public class PetService : IPetService
{
    private readonly IGeralPersist _geralPersist;
    private readonly IPetPersist _petPersist;

    public PetService(IGeralPersist geralPersist, IPetPersist petPersist)
    {
        _geralPersist = geralPersist;
        _petPersist = petPersist;
    }

    public async Task<Pet?> GetPetByIdAsync(int petId)
    {
        try
        {
            return await _petPersist.GetPetByIdAsync(petId);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }


    public async Task<bool> DeletePetById(int petId)
    {
        try
        {
            Pet pet = await _petPersist.GetPetByIdAsync(petId) ?? throw new Exception("Pet não encontrado");
            
            _geralPersist.Delete(pet);
            
            return await _geralPersist.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> UpdatePet(Pet pet)
    {
        try
        {
            if (await _petPersist.GetPetByIdAsync(pet.Id) != null)
            {
                pet.DataAtualizacao = DateTime.Now.Date;
                _geralPersist.Update(pet);

                return await _geralPersist.SaveChangesAsync();
            }

            return false;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}
