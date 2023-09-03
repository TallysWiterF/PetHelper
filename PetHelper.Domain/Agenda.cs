using PetHelper.Domain.Enums;

namespace PetHelper.Domain;

public class Agenda : IEntidadeBase
{
    public int Id { get; set; }
    public int PetShopId { get; set; }
    public PetShop PetShop { get; set; }
    public DateTime Horario { get; set; }
    public DiaSemanaEnum DiaSemana { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
}
