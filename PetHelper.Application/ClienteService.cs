using PetHelper.Application.Contratos;
using PetHelper.Application.Properties;
using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application;

public class ClienteService : IClienteService
{
    private readonly IGeralPersist _geralPersist;
    private readonly IClientePersist _clientePersist;

    private readonly PetService _petService;
    public ClienteService(IGeralPersist geralPersist, IClientePersist clientePersist, IPetPersist petPersist)
    {
        _geralPersist = geralPersist;
        _clientePersist = clientePersist;
        _petService = new PetService(geralPersist, petPersist);
    }

    public async Task<Cliente?> GetClienteByIdAsync(int clienteId)
    {
        try
        {
            return await _clientePersist.GetClienteByIdAsync(clienteId);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<Cliente?> GetClienteByNomeTelefoneAsync(string nome, string telefone)
    {
        try
        {
            return await _clientePersist.GetClienteByNomeTelefoneAsync(nome, telefone);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<Cliente?> GetClienteByPetShopIdTelefoneAsync(int petShopId, string telefone)
    {
        try
        {
            return await _clientePersist.GetClienteByPetShopIdTelefoneAsync(petShopId, telefone);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<Cliente[]> GetAllClientesByPetShopIdAsync(int petShopId)
    {
        try
        {
            return await _clientePersist.GetAllClientesByPetShopIdAsync(petShopId);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> AddCliente(Cliente clienteModel)
    {
        try
        {
            clienteModel.DataCriacao = clienteModel.DataAtualizacao = DateTime.Now.Date;
            _geralPersist.Add(clienteModel);

            return await _geralPersist.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> UpdateCliente(Cliente clienteModel)
    {
        try
        {
            Cliente? cliente = await _clientePersist.GetClienteByIdAsync(clienteModel.Id);
            if (cliente != null)
            {
                clienteModel.Pets = await ValidarPets(cliente, clienteModel);

                _geralPersist.Update(clienteModel);

                return await _geralPersist.SaveChangesAsync();
            }

            return false;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    private async Task<List<Pet>> ValidarPets(Cliente clienteSalvo, Cliente clienteModel)
    {
        try
        {
            foreach (Pet pet in clienteModel.Pets)
            {
                if (clienteSalvo.Pets.Any(x => x.Id == pet.Id))
                {
                    Pet petSalvo = clienteSalvo.Pets.FirstOrDefault(x => x.Id == pet.Id)!;

                    if (!petSalvo.Equals(pet))
                        pet.DataAtualizacao = DateTime.Now.Date;

                    clienteSalvo.Pets.RemoveAll(x => x.Id == pet.Id);
                }

                if (pet.DataCriacao == DateTime.MinValue)
                    pet.DataCriacao = DateTime.Now.Date;
            }

            if (clienteSalvo.Pets.Count > 0)
            {
                foreach (Pet pet in clienteSalvo.Pets)
                    await _petService.DeletePetById(pet.Id);
            }

            return clienteModel.Pets;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> DeleteClienteById(int clienteId)
    {
        try
        {
            Cliente? cliente = await _clientePersist.GetClienteByIdAsync(clienteId) ??
                throw new Exception(string.Format(Resource.MensagemDadoNaoEncontrado, "Cliente"));

            _geralPersist.Delete(cliente);

            return await _geralPersist.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}
