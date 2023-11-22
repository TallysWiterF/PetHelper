using PetHelper.Application.Contratos;
using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application;

public class ClienteService : IClienteService
{
    private readonly IGeralPersist _geralPersist;
    private readonly IClientePersist _clientePersist;

    public ClienteService(IGeralPersist geralPersist, IClientePersist clientePersist)
    {
        _geralPersist = geralPersist;
        _clientePersist = clientePersist;
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

    public async Task<Cliente[]?> GetAllClientesByPetShopIdAsync(int petShopId)
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
            if (await _clientePersist.GetClienteByIdAsync(clienteModel.Id) != null)
            {
                clienteModel.DataAtualizacao = DateTime.Now.Date;
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

    public async Task<bool> DeleteClienteById(int clienteId)
    {
        try
        {
            Cliente? cliente = await _clientePersist.GetClienteByIdAsync(clienteId);
            if (cliente is null)
                throw new Exception("Cliente não encontrado");

            _geralPersist.Delete(cliente);
            return await _geralPersist.SaveChangesAsync();

        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}
