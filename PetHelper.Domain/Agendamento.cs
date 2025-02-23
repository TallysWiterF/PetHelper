using System.ComponentModel.DataAnnotations.Schema;

namespace PetHelper.Domain;

public class Agendamento : IEntidadeBase
{
    public int Id { get; set; }
    public int PetShopId { get; set; }
    public int ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    public int ServicoId { get; set; }
    public Servico? Servico { get; set; }
    public int PetId { get; set; }

    [NotMapped]
    public Pet? Pet { get; set; }

    public string HorarioMarcado { get; set; } = string.Empty;
    public DateTime DataAgendamento { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
}
