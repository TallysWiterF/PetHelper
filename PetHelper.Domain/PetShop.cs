namespace PetHelper.Domain;

public class PetShop : IEntidadeBase
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Endereço { get; set; } = string.Empty;
    public byte[]? FotoPrincipal { get; set; }
    public byte[]? Logo { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
}
