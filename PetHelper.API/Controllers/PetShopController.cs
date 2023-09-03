﻿using Microsoft.AspNetCore.Mvc;
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
            PetShop petShop = await _petShopService.GetPetShopByIdAsync(id);
            if (petShop is null)
                return NotFound("PetShop não encontrado.");

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao tentar recuperar a Pet Shop. Erro: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(PetShop model)
    {
        try
        {
            PetShop? petShop = await _petShopService.AddPetShop(model);
            if (petShop is null)
                return BadRequest("Erro ao tentar adicionar a Pet Shop.");

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao tentar adicionar a Pet Shop. Erro: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, PetShop model)
    {
        try
        {
            PetShop? petShop = await _petShopService.UpdatePetShop(id, model);
            if (petShop is null)
                return BadRequest("Erro ao tentar atualizar a Pet Shop.");

            return Ok(petShop);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao tentar atualizar a Pet Shop. Erro: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            return await _petShopService.DeletePetShop(id) ?
                Ok("Pet Shop deletada.") : BadRequest("Ocorreu um erro ao deletar a Pet Shop");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao tentar deletar Pet Shop. Erro: {ex.Message}");
        }
    }
}