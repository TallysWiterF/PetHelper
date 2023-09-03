namespace PetHelper.Domain;

public class OrdemServico : IEntidadeBase
{
    public int PetShopId { get; set; }
    public PetShop? PetShop { get; set; }
    public int ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    public int ServicoId { get; set; }
    public Servico? Servico { get; set; }
    public DateTime DataAgendamento { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
}
