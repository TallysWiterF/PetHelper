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
                return NotFound(new { resposta = Resource.AgendamentoNaoEncontrado });

            return Ok(agendamento);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.ExcecaoRecuperarAgendamento, ex.Message) });
        }
    }

    [HttpGet("petShopId/{petShopId}/dataAgendamento/{dataAgendamento}")]
    public async Task<IActionResult> GetAllByPetShopIdDataAgendamento(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            Agendamento[] agendamentos = await _agendamentoService.GetAllAgendamentosByPetShopIdDataAgendamentoAsync(petShopId, dataAgendamento);
            if (agendamentos is null)
                return NotFound(new { resposta = Resource.AgendamentosNaoEncontrados });

            return Ok(agendamentos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.ExcecaoRecuperarAgendamentos, ex.Message) });
        }
    }

    [HttpGet("petShopId/{petShopId}/{dataAgendamento}")]
    public async Task<IActionResult> GetAllHorariosDisponiveisByPetShopIdDataAgendamento(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            string[] horariosMarcados = await _agendamentoService.GetAllHorariosDisponiveisByPetShopIdDataAgendamentoAsync(petShopId, dataAgendamento);
            if (horariosMarcados is null)
                return NotFound(new { resposta = Resource.HorariosNaoEncontrados });

            return Ok(horariosMarcados);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.ExcecaoRecuperarAgendamentos, ex.Message) });
        }
    }

    [HttpGet("informativos/{petShopId}/{dataAgendamento}")]
    public async Task<IActionResult> GetInformativosPetShop(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            Informativo informativos = _agendamentoService.GetInformativosPetShop(petShopId, dataAgendamento);
            if (informativos is null)
                return NotFound(new { resposta = Resource.InformativosNaoEncontrados });

            return Ok(informativos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.ExcecaoRecuperarInformativos, ex.Message) });
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
            return StatusCode(500, new { resposta = string.Format(Resource.ExcecaoRecuperarDatasDosAgendamentos, ex.Message) });
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
                return Ok(new { resposta = Resource.SucessoAdicionarAgendamento });
            }
            else
                return BadRequest(new { resposta = Resource.ErroAdicionarAgendamento });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.ExcecaoAdicionarAgendamento, ex.Message) });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(Agendamento model)
    {
        try
        {
            return await _agendamentoService.UpdateAgendamento(model) ?
                 Ok(new { resposta = Resource.SucessoAtualizarAgendamento }) :
                 BadRequest(new { resposta = Resource.ErroAtualizarAgendamento });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.ExcecaoAtualizarAgendamento, ex.Message) });
        }
    }

    [HttpDelete("{agendamentoId}")]
    public async Task<IActionResult> Delete(int agendamentoId)
    {
        try
        {
            return await _agendamentoService.DeleteAgendamentoById(agendamentoId) ?
                 Ok(new { resposta = Resource.SucessoDeletarAgendamento }) :
                 BadRequest(new { resposta = Resource.ErroDeletarAgendamento });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.ExcecaoDeletarAgendamento, ex.Message) });
        }
    }
}
