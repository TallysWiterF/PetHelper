namespace PetHelper.Domain;

public class Informativo
{
    public int TotalAgendamentos { get; set; }
    public string PorcentagemAgendamentos { get; set; } = string.Empty;
    public int TotalServicos { get; set; }
    public string PorcentagemServicos { get; set; } = string.Empty;
    public decimal TotalRendimentos { get; set; }
    public string PorcentagemRendimentos { get; set; } = string.Empty;
    public int TotalClientes { get; set; }
    public string PorcentagemClientes { get; set; } = string.Empty;
}
