namespace PetHelper.Domain;

public class PetShop : IEntidadeBase
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string Endereço { get; set; } = string.Empty;
    public string? FotoPrincipal { get; set; }
    public string? Logo { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
}

public class LoginModel
{
    public string Email { get; set; }
    public string Senha { get; set; }
}

public class InscricaoModel
{
    public string Proprietario { get; set; }
    public string Email { get; set; }
    public string NomePetShop { get; set; }
    public string Telefone { get; set; }
}

