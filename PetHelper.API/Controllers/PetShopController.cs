using Microsoft.AspNetCore.Mvc;
using PetHelper.API.Properties;
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
                return NotFound(new { resposta = string.Format(Resource.MensagemDadoNaoEncontrado, "Pet Shop") });

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "o Pet Shop", ex.Message) });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> RealizarLogin([FromBody] LoginModel model)
    {
        try
        {
            PetShop? petShop = await _petShopService.GetPetShopByEmailSenha(model.Email, model.Senha);
            if (petShop is null)
                return NotFound(new { resposta = string.Format(Resource.MensagemDadoNaoEncontrado, "Pet Shop") });

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoRecuperar, "o Pet Shop", ex.Message) });
        }
    }

    [HttpPost("inscricao")]
    public IActionResult RealizarInscricao(InscricaoModel model)
    {
        try
        {
            return _petShopService.EnviarEmailInscricao(model) ?
            Ok(new { resposta = Resource.EmailDeInscricaoJaEnviado }) : 
            BadRequest(new { resposta = string.Format(Resource.MensagemErroProcesso, "inscrição de Pet Shop") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoProcesso, "inscrição de Pet Shop", ex.Message) });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(PetShop model)
    {
        try
        {
            if (await _petShopService.ValidarEmailJaCadastrado(model.Email))
                return BadRequest(new { resposta = string.Format(Resource.MensagemErroAdicionar, "Pet Shop. E-mail já cadastrado") });

            PetShop? petShop = await _petShopService.AddPetShop(model);
            if (petShop is null)
                return BadRequest(new { resposta = string.Format(Resource.MensagemErroAdicionar, "Pet Shop") });

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoAdicionar, "o Pet Shop", ex.Message) });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, PetShop model)
    {
        try
        {
            PetShop? petShop = await _petShopService.UpdatePetShop(id, model);
            if (petShop is null)
                return BadRequest(new { resposta = string.Format(Resource.MensagemErroAtualizar, "Pet Shop") });

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoAtualizar, "o Pet Shop", ex.Message) });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            return await _petShopService.DeletePetShop(id) ?
                Ok(new { resposta = string.Format(Resource.MensagemSucessoDeletar, "Pet Shop") }) :
                 BadRequest(new { resposta = string.Format(Resource.MensagemErroDeletar, "Pet Shop") });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { resposta = string.Format(Resource.MensagemExcecaoDeletar, "o Pet Shop", ex.Message) });
        }
    }
}
