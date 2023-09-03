namespace PetHelper.Domain;

public interface IEntidadeBase
{
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
}