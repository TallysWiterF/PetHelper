namespace PetHelper.Domain;

public class Servico : IEntidadeBase, IEquatable<Servico>
{
    public int Id { get; set; }
    public int PetShopId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public decimal Preco { get; set; }
    public string? LogoServico { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }

    public bool Equals(Servico servicoModel) => Id == servicoModel.Id &&
               PetShopId == servicoModel.PetShopId &&
               Nome == servicoModel.Nome.Trim() &&
               Descricao == servicoModel.Descricao &&
               Preco == servicoModel.Preco &&
               Ativo == servicoModel.Ativo;
}
