using Microsoft.AspNetCore.Mvc;
using PetHelper.API.Properties;
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
                return NotFound(new { resposta = string.Format(Resource.MensagemDadoNaoEncontrado, "Serviço") });

            return Ok(servico);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "o serviço", ex.Message) });
        }
    }

    [HttpGet("petShopId/{petShopId}/{retornarLogoServico}")]
    public async Task<IActionResult> GetAllByPetShopId(int petShopId, bool retornarLogoServico)
    {
        try
        {
            Servico[] servicos = await _servicoService.GetAllServicosByPetShopIdAsync(petShopId, retornarLogoServico);
            if (servicos is null)
                return NotFound(new { resposta = string.Format(Resource.MensagemDadosNaoEncontrados, "Serviços") });

            return Ok(servicos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "os serviços", ex.Message) });
        }
    }

    [HttpGet("petShopId/{petShopId}/ativo/{ativo}")]
    public async Task<IActionResult> GetAllServicosAtivosByPetShopId(int petShopId, bool ativo)
    {
        try
        {
            Servico[] servicos = await _servicoService.GetAllServicosAtivosByPetShopIdAsync(petShopId, ativo);
            if (servicos is null)
                return NotFound(new { resposta = string.Format(Resource.MensagemDadosNaoEncontrados, "Serviços") });

            return Ok(servicos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "os serviços", ex.Message) });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(Servico model)
    {
        try
        {
            return await _servicoService.AddServico(model) ?
                  Ok(new { resposta = string.Format(Resource.MensagemSucessoAdicionar, "Serviço") }) :
                  BadRequest(new { resposta = string.Format(Resource.MensagemErroAdicionar, "serviço") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoAdicionar, "o serviço", ex.Message) });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(Servico model)
    {
        try
        {
            return await _servicoService.UpdateServico(model) ?
                 Ok(new { resposta = string.Format(Resource.MensagemSucessoAtualizar, "Serviço") }) :
                 BadRequest(new { resposta = string.Format(Resource.MensagemErroAtualizar, "serviço") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoAtualizar, "o serviço", ex.Message) });
        }
    }

    [HttpDelete("{servicoId}")]
    public async Task<IActionResult> Delete(int servicoId)
    {
        try
        {
            return await _servicoService.DeleteServicoById(servicoId) ?
                  Ok(new { resposta = string.Format(Resource.MensagemSucessoDeletar, "Serviço") }) :
                 BadRequest(new { resposta = string.Format(Resource.MensagemErroDeletar, "serviço") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoDeletar, "o serviço", ex.Message) });
        }
    }

}
