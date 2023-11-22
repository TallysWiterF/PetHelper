using Microsoft.AspNetCore.Mvc;
using PetHelper.Application.Contratos;
using PetHelper.Domain;

namespace PetHelper.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicoController : ControllerBase
{
    private readonly IServicoService _servicoService;
    public ServicoController(IServicoService servicoService) => _servicoService = servicoService;

    [HttpGet("{servicoId}")]
    public async Task<IActionResult> GetById(int servicoId)
    {
        try
        {
            Servico servico = await _servicoService.GetServicoByIdAsync(servicoId);
            if (servico is null)
                return NotFound(new { resposta = "Serviço não encontrado." });

            return Ok(servico);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar serviço. Erro: {ex.Message}" });
        }
    }

    [HttpGet("petShopId/{petShopId}/{retornarLogoServico}")]
    public async Task<IActionResult> GetAllByPetShopId(int petShopId, bool retornarLogoServico)
    {
        try
        {
            Servico[] servicos = await _servicoService.GetAllServicosByPetShopIdAsync(petShopId, retornarLogoServico);
            if (servicos is null)
                return NotFound(new { resposta = "Serviços não encontrados." });

            return Ok(servicos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar serviços. Erro: {ex.Message}" });
        }
    }

    [HttpGet("petShopId/{petShopId}/ativo/{ativo}")]
    public async Task<IActionResult> GetAllServicosAtivosByPetShopId(int petShopId, bool ativo)
    {
        try
        {
            Servico[] servicos = await _servicoService.GetAllServicosAtivosByPetShopIdAsync(petShopId, ativo);
            if (servicos is null)
                return NotFound(new { resposta = "Serviços não encontrados." });

            return Ok(servicos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar serviços. Erro: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(Servico model)
    {
        try
        {
            return await _servicoService.AddServico(model) ?
                  Ok(new { resposta = "Serviço adicionado com sucesso!" }) :
                  BadRequest(new { resposta = "Ocorreu um erro ao tentar adicionar o serviço." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar adicionar o serviço. Erro: {ex.Message}" });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(Servico model)
    {
        try
        {
            return await _servicoService.UpdateServico(model) ?
                 Ok(new { resposta = "Serviço alterado com sucesso!" }) :
                 BadRequest(new { resposta = "Ocorreu um erro ao tentar editar o serviço." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar editar serviço. Erro: {ex.Message}" });
        }
    }

    [HttpDelete("{servicoId}")]
    public async Task<IActionResult> Delete(int servicoId)
    {
        try
        {
            return await _servicoService.DeleteServicoById(servicoId) ?
                 Ok(new { resposta = "Serviço deletado com sucesso!" }) :
                 BadRequest(new { resposta = "Ocorreu um erro ao tentar deletar o serviço." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar deletar o serviço. Erro: {ex.Message}" });
        }
    }

}
