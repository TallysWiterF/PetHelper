namespace PetHelper.Domain;

public enum RacasEnum
{
    Cachorro = 1,
    Gato = 2
}

public class Pet : IEntidadeBase
{
    public int Id { get; set; }
    public int PetShopId { get; set; }
    public int ClienteId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Raca { get; set; } = string.Empty;
    public RacasEnum Tipo { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }

    public bool Equals(Pet pet) => Id == pet.Id &&
                                   PetShopId == pet.PetShopId &&
                                   ClienteId == pet.ClienteId &&
                                   Nome == pet.Nome.Trim() &&
                                   Raca == pet.Raca &&
                                   Tipo == pet.Tipo;

}
