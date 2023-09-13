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
    public async Task<Cliente> GetClienteByIdAsync(int clienteId)
    {
        try
        {
            Cliente? cliente = await _clientePersist.GetClienteByIdAsync(clienteId);

            return cliente;
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
            Cliente[]? clientes = await _clientePersist.GetAllClientesByPetShopIdAsync(petShopId);

            if (clientes is null)
                return null;

            return clientes;
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
            clienteModel.DataCriacao = clienteModel.DataAtualizacao = DateTime.UtcNow;
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
            Cliente cliente = await _clientePersist.GetClienteByIdAsync(clienteModel.Id);
            if (cliente != null)
            {
                clienteModel.DataAtualizacao = DateTime.UtcNow;

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
            Cliente cliente = await _clientePersist.GetClienteByIdAsync(clienteId);
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
