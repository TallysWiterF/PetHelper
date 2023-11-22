using PetHelper.Application.Contratos;
using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application;

public class ServicoService : IServicoService
{
    private readonly IGeralPersist _geralPersist;
    private readonly IServicoPersist _servicoPersist;

    public ServicoService(IGeralPersist geralPersist, IServicoPersist servicoPersist)
    {
        _geralPersist = geralPersist;
        _servicoPersist = servicoPersist;
    }

    public async Task<Servico> GetServicoByIdAsync(int servicoId)
    {
        try
        {
            return await _servicoPersist.GetServicoByIdAsync(servicoId);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<Servico[]> GetAllServicosByPetShopIdAsync(int petShopId, bool retornarLogoServico)
    {
        try
        {
            return await _servicoPersist.GetAllServicosByPetShopIdAsync(petShopId, retornarLogoServico);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<Servico[]> GetAllServicosAtivosByPetShopIdAsync(int petShopId, bool ativo)
    {
        try
        {
            return await _servicoPersist.GetAllServicosAtivosByPetShopIdAsync(petShopId, ativo);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> AddServico(Servico servicoModel)
    {
        try
        {
            servicoModel.Nome = servicoModel.Nome.TrimEnd();

            if (!string.IsNullOrEmpty(servicoModel.Descricao))
                servicoModel.Descricao = servicoModel.Descricao?.TrimEnd();

            servicoModel.DataCriacao = servicoModel.DataAtualizacao = DateTime.Now.Date;
            _geralPersist.Add(servicoModel);

            return await _geralPersist.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> UpdateServico(Servico servicoModel)
    {
        try
        {
            if (await _servicoPersist.GetServicoByIdAsync(servicoModel.Id) != null)
            {
                servicoModel.DataAtualizacao = DateTime.Now.Date;
                _geralPersist.Update(servicoModel);

                return await _geralPersist.SaveChangesAsync();
            }

            return false;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> DeleteServicoById(int servicoId)
    {
        try
        {
            Servico servico = await _servicoPersist.GetServicoByIdAsync(servicoId);
            if (servico is null)
                throw new Exception("Serviço não encontrado");

            _geralPersist.Delete(servico);
            return await _geralPersist.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }


}
