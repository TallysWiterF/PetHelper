using Microsoft.AspNetCore.Mvc;
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
            Cliente cliente = await _clienteService.GetClienteByIdAsync(clienteId);
            if (cliente is null)
                return NotFound(new { resposta = "Cliente não encontrado." });

            return Ok(cliente);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar cliente. Erro: {ex.Message}" });
        }
    }

    [HttpGet("petShopId/{petShopId}")]
    public async Task<IActionResult> GetAllByPetShopId(int petShopId)
    {
        try
        { 
            Cliente[] clientes = await _clienteService.GetAllClientesByPetShopIdAsync(petShopId);
            if (clientes is null)
                return NotFound(new { resposta = "Clientes não encontrados." });

            return Ok(clientes);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar clientes. Erro: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(Cliente model)
    {
        try
        {
            return await _clienteService.AddCliente(model) ?
                  Ok(new { resposta = "Cliente adicionado com sucesso!" }) :
                  BadRequest(new { resposta = "Ocorreu um erro ao tentar adicionar o cliente." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar adicionar o cliente. Erro: {ex.Message}" });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(Cliente model)
    {
        try
        {
            return await _clienteService.UpdateCliente(model) ?
                 Ok(new { resposta = "Cliente alterado com sucesso!" }) :
                 BadRequest(new { resposta = "Ocorreu um erro ao tentar editar o cliente." }); 
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar editar cliente. Erro: {ex.Message}" });
        }
    }

    [HttpDelete("{clienteId}")]
    public async Task<IActionResult> Delete(int clienteId)
    {
        try
        {
            return await _clienteService.DeleteClienteById(clienteId) ?
                 Ok(new { resposta = "Cliente deletado com sucesso!" }) :
                 BadRequest(new { resposta = "Ocorreu um erro ao tentar deletar o cliente." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar deletar o cliente. Erro: {ex.Message}" });
        }
    }

}
