using Microsoft.Extensions.Configuration;
using PetHelper.Application.Contratos;
using PetHelper.Domain;
using PetHelper.Persistence.Contratos;
using System.Net.Mail;
using System.Net;
using BCryptNet = BCrypt.Net.BCrypt;

namespace PetHelper.Application;

public class PetShopService : IPetShopService
{
    private readonly IGeralPersist _geralPersist;
    private readonly IPetShopPersist _petShopPersist;
    private readonly IConfiguration _configuration;

    public PetShopService(IGeralPersist geralPersist, IPetShopPersist petShopPersist, IConfiguration configuration)
    {
        _geralPersist = geralPersist;
        _petShopPersist = petShopPersist;
        _configuration = configuration;
    }

    public async Task<PetShop?> GetPetShopByIdAsync(int petShopId)
    {
        try
        {
            PetShop? petShop = await _petShopPersist.GetPetShopByIdAsync(petShopId);

            return petShop;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<PetShop?> GetPetShopByEmailSenha(string email, string senha)
    {
        try
        {
            return await _petShopPersist.GetPetShopByEmailSenha(email, senha);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public bool EnviarEmailInscricao(InscricaoModel model)
    {
        MailAddress remetente = new(_configuration["SecretConfiguration:Email"], "PetHelper");
        MailAddress destinatario = new(_configuration["SecretConfiguration:SendTo"]);

        using SmtpClient smtpClient = new("smtp.gmail.com", 587);
        smtpClient.UseDefaultCredentials = false;
        smtpClient.Credentials = new NetworkCredential(_configuration["SecretConfiguration:Email"],
                                                       _configuration["SecretConfiguration:Password"]);

        // Protocolo de segurança
        smtpClient.EnableSsl = true;

        MailMessage mensagem = new(remetente, destinatario)
        {
            Subject = "Inscrição Protótipo PetHelper",
            Body = $"A Pet Shop '{model.NomePetShop}', gostaria de participar da fase de testes do produto.\nNome Proprietário: {model.Proprietario}.\nE-mail: {model.Email}\nTelefone: {model.Telefone}",
            Priority = MailPriority.High,
        };

        try
        {
            smtpClient.Send(mensagem);
            return true;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<PetShop?> AddPetShop(PetShop petShopModel)
    {
        try
        {
            petShopModel.Senha = BCryptNet.HashPassword(petShopModel.Senha, BCryptNet.GenerateSalt());

            _geralPersist.Add(petShopModel);
            if (await _geralPersist.SaveChangesAsync())
                return await _petShopPersist.GetPetShopByIdAsync(petShopModel.Id);

            return null;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<PetShop?> UpdatePetShop(int petShopId, PetShop model)
    {
        try
        {
            PetShop? petShop = await _petShopPersist.GetPetShopByIdAsync(petShopId);
            if (petShop != null)
            {
                model.Id = petShop.Id;

                _geralPersist.Update(model);
                if (await _geralPersist.SaveChangesAsync())
                    return await _petShopPersist.GetPetShopByIdAsync(model.Id);
            }

            return null;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> DeletePetShop(int petShopId)
    {
        try
        {
            PetShop? petShop = await _petShopPersist.GetPetShopByIdAsync(petShopId);
            if (petShop is null)
                throw new Exception("Pet Shop não encontrada");

            _geralPersist.Delete(petShop);
            return await _geralPersist.SaveChangesAsync();

        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> ValidarEmailJaCadastrado(string email)
    {
        try
        {
            return await _petShopPersist.ValidarEmailJaCadastrado(email);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}