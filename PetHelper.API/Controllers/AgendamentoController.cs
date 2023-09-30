using Microsoft.AspNetCore.Mvc;
using PetHelper.Application.Contratos;
using PetHelper.Domain;

namespace PetHelper.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgendamentoController : ControllerBase
{
    IAgendamentoService _agendamentoService;

    public AgendamentoController(IAgendamentoService agendamentoService) => _agendamentoService = agendamentoService;

    [HttpGet("{agendamentoId}")]
    public async Task<IActionResult> GetById(int agendamentoId)
    {
        try
        {
            Agendamento agendamento = await _agendamentoService.GetAgendamentoByIdAsync(agendamentoId);
            if (agendamento is null)
                return NotFound(new { resposta = "Agendamento não encontrado." });

            return Ok(agendamento);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar agendamento. Erro: {ex.Message}" });
        }
    }

    [HttpGet("petShopId/{petShopId}/dataAgendamento/{dataAgendamento}")]
    public async Task<IActionResult> GetAllByPetShopIdDataAgendamento(int petShopId, DateTime dataAgendamento)
    {
        try
        {
            Agendamento[] agendamentos = await _agendamentoService.GetAllAgendamentosByPetShopIdDataAgendamentoAsync(petShopId, dataAgendamento);
            if (agendamentos is null)
                return NotFound(new { resposta = "Agendamentos não encontrados." });

            return Ok(agendamentos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar agendamentos. Erro: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(Agendamento model)
    {
        try
        {
            return await _agendamentoService.AddAgendamento(model) ?
                  Ok(new { resposta = "Agendamento adicionado com sucesso!" }) :
                  BadRequest(new { resposta = "Ocorreu um erro ao tentar adicionar o agendamento." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar adicionar o agendamento. Erro: {ex.Message}" });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(Agendamento model)
    {
        try
        {
            return await _agendamentoService.UpdateAgendamento(model) ?
                 Ok(new { resposta = "Agendamento alterado com sucesso!" }) :
                 BadRequest(new { resposta = "Ocorreu um erro ao tentar editar o agendamento." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar editar agendamento. Erro: {ex.Message}" });
        }
    }

    [HttpDelete("{agendamentoId}")]
    public async Task<IActionResult> Delete(int agendamentoId)
    {
        try
        {
            return await _agendamentoService.DeleteAgendamentoById(agendamentoId) ?
                 Ok(new { resposta = "Agendamento deletado com sucesso!" }) :
                 BadRequest(new { resposta = "Ocorreu um erro ao tentar deletar o agendamento." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar deletar o agendamento. Erro: {ex.Message}" });
        }
    }
}
