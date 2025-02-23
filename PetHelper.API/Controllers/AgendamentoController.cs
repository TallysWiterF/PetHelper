using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PetHelper.API.Hubs;
using PetHelper.API.Properties;
using PetHelper.Application.Contratos;
using PetHelper.Domain;

namespace PetHelper.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgendamentoController : ControllerBase
{
    IAgendamentoService _agendamentoService;
    readonly IHubContext<AgendamentoHub> _hubContext;

    public AgendamentoController(IAgendamentoService agendamentoService, IHubContext<AgendamentoHub> hubContext)
    {
        _agendamentoService = agendamentoService;
        _hubContext = hubContext;
    }

    [HttpGet("{agendamentoId}")]
    public async Task<IActionResult> GetById(int agendamentoId)
    {
        try
        {
            Agendamento? agendamento = await _agendamentoService.GetAgendamentoByIdAsync(agendamentoId);
            if (agendamento is null)
                return NotFound(new { resposta = string.Format(Resource.MensagemDadoNaoEncontrado, "Agendamento") });

            return Ok(agendamento);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "o agendamento",  ex.Message) });
        }
    }

    [HttpGet("petShopId/{petShopId}/dataAgendamento/{dataAgendamento}")]
    public async Task<IActionResult> GetAllByPetShopIdDataAgendamento(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            Agendamento[] agendamentos = await _agendamentoService.GetAllAgendamentosByPetShopIdDataAgendamentoAsync(petShopId, dataAgendamento);
            if (agendamentos is null)
                return NotFound(new { resposta = string.Format(Resource.MensagemDadosNaoEncontrados, "Agendamentos") });

            return Ok(agendamentos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "os agendamentos", ex.Message) });
        }
    }

    [HttpGet("petShopId/{petShopId}/{dataAgendamento}")]
    public async Task<IActionResult> GetAllHorariosDisponiveisByPetShopIdDataAgendamento(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            string[] horariosMarcados = await _agendamentoService.GetAllHorariosDisponiveisByPetShopIdDataAgendamentoAsync(petShopId, dataAgendamento);
            if (horariosMarcados is null)
                return NotFound(new { resposta = string.Format(Resource.MensagemDadosNaoEncontrados, "Horários marcados") });

            return Ok(horariosMarcados);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "os horários marcados", ex.Message) });
        }
    }

    [HttpGet("informativos/{petShopId}/{dataAgendamento}")]
    public async Task<IActionResult> GetInformativosPetShop(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            Informativo informativos = _agendamentoService.GetInformativosPetShop(petShopId, dataAgendamento);
            if (informativos is null)
                return NotFound(new { resposta = string.Format(Resource.MensagemDadosNaoEncontrados, "Informativos") });

            return Ok(informativos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "os informativos", ex.Message) });
        }
    }

    [HttpGet("petShopId/{petShopId}/mes/{mes}")]
    public async Task<IActionResult> GetAllDiasComAgendamentosByPetShopIdMes(int petShopId, int mes)
    {
        try
        {
            int[] diasAgendamentos = await _agendamentoService.GetAllDiasComAgendamentosByPetShopIdMesAsync(petShopId, mes);

            return Ok(diasAgendamentos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "as datas dos agendamentos", ex.Message) });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(Agendamento model)
    {
        try
        {
            if (await _agendamentoService.AddAgendamento(model))
            {
                await _hubContext.Clients.All.SendAsync("NovoAgendamentoCadastrado");
                return Ok(new { resposta = string.Format(Resource.MensagemSucessoAdicionar, "Agendamento") });
            }
            else
                return BadRequest(new { resposta = string.Format(Resource.MensagemErroAdicionar, "agendamento") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoAdicionar, "o agendamento", ex.Message) });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(Agendamento model)
    {
        try
        {
            return await _agendamentoService.UpdateAgendamento(model) ?
                 Ok(new { resposta = string.Format(Resource.MensagemSucessoAtualizar, "Agendamento") }) :
                 BadRequest(new { resposta = string.Format(Resource.MensagemErroAtualizar, "agendamento") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoAtualizar, "o agendamento", ex.Message) });
        }
    }

    [HttpDelete("{agendamentoId}")]
    public async Task<IActionResult> Delete(int agendamentoId)
    {
        try
        {
            return await _agendamentoService.DeleteAgendamentoById(agendamentoId) ?
                 Ok(new { resposta = string.Format(Resource.MensagemSucessoDeletar, "Agendamento") }) :
                 BadRequest(new { resposta = string.Format(Resource.MensagemErroDeletar, "agendamento") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoDeletar, "o agendamento", ex.Message) });
        }
    }
}
