using PetHelper.Application.Contratos;
using PetHelper.Domain;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Application;

public class AgendamentoService : IAgendamentoService
{
    private readonly IGeralPersist _geralPersist;
    private readonly IAgendamentoPersist _agendamentoPersist;

    private readonly ClienteService _clienteService;
    private readonly ServicoService _servicoService;

    public AgendamentoService(IGeralPersist geralPersist, IAgendamentoPersist agendamentoPersist, IClientePersist clientePersist, IServicoPersist servicoPersist)
    {
        _geralPersist = geralPersist;
        _agendamentoPersist = agendamentoPersist;

        _clienteService = new ClienteService(geralPersist, clientePersist);
        _servicoService = new ServicoService(geralPersist, servicoPersist);
    }

    public async Task<Agendamento?> GetAgendamentoByIdAsync(int agendamentoId)
    {
        try
        {
            return await _agendamentoPersist.GetAgendamentoByIdAsync(agendamentoId);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<Agendamento[]> GetAllAgendamentosByPetShopIdDataAgendamentoAsync(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            Agendamento[] agendamentos = await _agendamentoPersist.GetAllAgendamentosByPetShopIdDataAgendamentoAsync(petShopId, dataAgendamento);

            agendamentos = await RecuperarDadosAgendamentos(agendamentos);
            return agendamentos;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<string[]> GetAllHorariosDisponiveisByPetShopIdDataAgendamentoAsync(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            return await _agendamentoPersist.GetAllHorariosDisponiveisByPetShopIdDataAgendamentoAsync(petShopId, dataAgendamento);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<int[]> GetAllDiasComAgendamentosByPetShopIdMesAsync(int petShopId, int mes)
    {
        try
        {
            return await _agendamentoPersist.GetAllDiasComAgendamentosByPetShopIdMesAsync(petShopId, mes);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public Informativo GetInformativosPetShop(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            return _agendamentoPersist.GetInformativosPetShop(petShopId, dataAgendamento);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> AddAgendamento(Agendamento agendamentoModel)
    {
        try
        {
            agendamentoModel = await ValidarAgendamento(agendamentoModel);

            agendamentoModel.DataCriacao = agendamentoModel.DataAtualizacao = DateTime.Now.Date;
            _geralPersist.Add(agendamentoModel);
            return await _geralPersist.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> UpdateAgendamento(Agendamento agendamentoModel)
    {
        try
        {
            agendamentoModel = await ValidarAgendamento(agendamentoModel);

            agendamentoModel.DataAtualizacao = DateTime.Now.Date;
            _geralPersist.Update(agendamentoModel);
            return await _geralPersist.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> DeleteAgendamentoById(int agendamentoId)
    {
        try
        {
            Agendamento? agendamento = await _agendamentoPersist.GetAgendamentoByIdAsync(agendamentoId);
            if (agendamento is null)
                throw new Exception("Agendamento não encontrado.");

            _geralPersist.Delete(agendamento);

            return await _geralPersist.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    #region ValidacoesAgendamentos
    private async Task<Agendamento[]> RecuperarDadosAgendamentos(Agendamento[] agendamentosModel)
    {
        foreach (var agendamentoItem in agendamentosModel)
        {
            agendamentoItem.Cliente = await _clienteService.GetClienteByIdAsync(agendamentoItem.ClienteId);
            agendamentoItem.Servico = await _servicoService.GetServicoByIdAsync(agendamentoItem.ServicoId);
            agendamentoItem.Servico.LogoServico = null;
        }

        return agendamentosModel;
    }

    private async Task<Agendamento> ValidarAgendamento(Agendamento agendamento)
    {
        if (agendamento.Cliente != null)
            agendamento.Cliente = await ValidarCliente(agendamento.Cliente);

        if (agendamento.Servico != null)
            agendamento.Servico = await ValidarServico(agendamento.Servico);

        return agendamento;
    }

    private async Task<Cliente?> ValidarCliente(Cliente clienteModel)
    {
        Cliente? cliente = await _clienteService.GetClienteByIdAsync(clienteModel.Id);

        if (cliente == null)
        {
            clienteModel.DataCriacao = clienteModel.DataAtualizacao = DateTime.Now.Date;
            return clienteModel;
        }
        else if (!cliente.Equals(clienteModel))
        {
            clienteModel.DataAtualizacao = DateTime.Now.Date;
            await _clienteService.UpdateCliente(clienteModel);
        }

        return null;
    }

    private async Task<Servico?> ValidarServico(Servico servicoModel)
    {
        Servico servico = await _servicoService.GetServicoByIdAsync(servicoModel.Id);

        if (servico == null)
        {
            servicoModel.DataCriacao = servicoModel.DataAtualizacao = DateTime.Now.Date;
            return servicoModel;
        }
        else if (!servico.Equals(servicoModel))
            await _servicoService.UpdateServico(servicoModel);

        return null;
    }

    #endregion
}
