namespace PetHelper.Domain;

public class Cliente : IEntidadeBase
{
    public int Id { get; set; }
    public int PetShopId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Complemento { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
}
