using Microsoft.AspNetCore.Mvc;
using PetHelper.Application.Contratos;
using PetHelper.Domain;

namespace PetHelper.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PetShopController : ControllerBase
{
    private readonly IPetShopService _petShopService;
    public PetShopController(IPetShopService petShopService) => _petShopService = petShopService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            PetShop? petShop = await _petShopService.GetPetShopByIdAsync(id);
            if (petShop is null)
                return NotFound(new { resposta = "Pet Shop não encontrado." });

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar a Pet Shop. Erro: {ex.Message}" });
        }
    }

    [HttpGet("{email}/{senha}")]
    public async Task<IActionResult> RealizarLogin(string email, string senha)
    {
        try
        {
            PetShop? petShop = await _petShopService.GetPetShopByEmailSenha(email, senha);
            if (petShop is null)
                return NotFound(new { resposta = "Pet Shop não encontrada." });

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar a Pet Shop. Erro: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> RealizarLogin([FromBody] LoginModel model)
    {
        try
        {
            PetShop? petShop = await _petShopService.GetPetShopByEmailSenha(model.Email, model.Senha);
            if (petShop is null)
                return NotFound(new { resposta = "Pet Shop não encontrada." });

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar recuperar a Pet Shop. Erro: {ex.Message}" });
        }
    }


    [HttpPost]
    public async Task<IActionResult> Post(PetShop model)
    {
        try
        {
            if (await _petShopService.ValidarEmailJaCadastrado(model.Email))
                return BadRequest(new { resposta = "Erro ao tentar adicionar a Pet Shop. E-mail já cadastrado" });

            PetShop? petShop = await _petShopService.AddPetShop(model);
            if (petShop is null)
                return BadRequest(new { resposta = "Erro ao tentar adicionar a Pet Shop." });

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar adicionar a Pet Shop. Erro: {ex.Message}" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, PetShop model)
    {
        try
        {
            PetShop? petShop = await _petShopService.UpdatePetShop(id, model);
            if (petShop is null)
                return BadRequest(new { resposta = "Erro ao tentar atualizar a Pet Shop." });

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar atualizar a Pet Shop. Erro: {ex.Message}" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            return await _petShopService.DeletePetShop(id) ?
                Ok(new { resposta = "Pet Shop deletada." }) : BadRequest(new { resposta = "Ocorreu um erro ao deletar a Pet Shop" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = $"Erro ao tentar deletar Pet Shop. Erro: {ex.Message}"});
        }
    }
}
