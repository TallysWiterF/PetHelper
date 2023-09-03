namespace PetHelper.Domain;

public class Servico : IEntidadeBase
{
    public int Id { get; set; }
    public int PetShopId { get; set; }
    public PetShop? PetShop { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public byte[]? LogoServico {get; set;}
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
}
