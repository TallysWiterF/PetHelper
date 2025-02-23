using Microsoft.AspNetCore.Mvc;
using PetHelper.API.Properties;
using PetHelper.Application.Contratos;
using PetHelper.Domain;

namespace PetHelper.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClienteController : ControllerBase
{
    private readonly IClienteService _clienteService;
    public ClienteController(IClienteService clienteService) => _clienteService = clienteService;

    [HttpGet("{clienteId}")]
    public async Task<IActionResult> GetById(int clienteId)
    {
        try
        {
            Cliente? cliente = await _clienteService.GetClienteByIdAsync(clienteId);
            if (cliente is null)
                return NotFound(new { resposta = string.Format(Resource.MensagemDadoNaoEncontrado, "Cliente") });

            return Ok(cliente);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "o Cliente", ex.Message) });
        }
    }

    [HttpGet("petShopId/{petShopId}")]
    public async Task<IActionResult> GetAllByPetShopId(int petShopId)
    {
        try
        {
            Cliente[] clientes = await _clienteService.GetAllClientesByPetShopIdAsync(petShopId);
            if (clientes is null)
                return NotFound(new { resposta = string.Format(Resource.MensagemDadosNaoEncontrados, "Clientes") });

            return Ok(clientes);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "os clientes", ex.Message) });
        }
    }

    [HttpGet("petShopId/{petShopId}/{telefone}")]
    public async Task<IActionResult> GetClienteByPetShopIdTelefoneAsync(int petShopId, string telefone)
    {
        try
        {
            Cliente? cliente = await _clienteService.GetClienteByPetShopIdTelefoneAsync(petShopId, telefone);
            if (cliente is null)
                return Ok(new Cliente()
                {
                    PetShopId = petShopId,
                    Telefone = telefone
                });

            return Ok(cliente);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "o cliente", ex.Message) });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(Cliente model)
    {
        try
        {
            return await _clienteService.AddCliente(model) ?
                  Ok(new { resposta = string.Format(Resource.MensagemSucessoAdicionar, "Cliente") }) :
                  BadRequest(new { resposta = string.Format(Resource.MensagemErroAdicionar, "o cliente") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoAdicionar, "o cliente", ex.Message) });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(Cliente model)
    {
        try
        {
            return await _clienteService.UpdateCliente(model) ?
                 Ok(new { resposta = string.Format(Resource.MensagemSucessoAtualizar, "Cliente") }) :
                 BadRequest(new { resposta = string.Format(Resource.MensagemErroAtualizar, "o cliente") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoAtualizar, "o cliente", ex.Message) });
        }
    }

    [HttpDelete("{clienteId}")]
    public async Task<IActionResult> Delete(int clienteId)
    {
        try
        {
            return await _clienteService.DeleteClienteById(clienteId) ?
                 Ok(new { resposta = string.Format(Resource.MensagemSucessoDeletar, "Cliente") }) :
                 BadRequest(new { resposta = string.Format(Resource.MensagemErroDeletar, "o cliente") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoDeletar, "o cliente", ex.Message) });
        }
    }

}
