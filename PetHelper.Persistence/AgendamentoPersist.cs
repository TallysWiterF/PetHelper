using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;
using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;

namespace PetHelper.Persistence;

public class AgendamentoPersist : IAgendamentoPersist
{
    private readonly PetHelperContext _context;

    private DateTime _primeiroDiaDoMes;
    private DateTime _ultimoDiaDoMes;

    public AgendamentoPersist(PetHelperContext context)
    {
        _context = context;
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    public async Task<Agendamento?> GetAgendamentoByIdAsync(int agendamentoId) => await _context.Agendamentos.Where(p => p.Id == agendamentoId)
                                                                                                             .OrderBy(p => p.DataAgendamento)
                                                                                                             .FirstOrDefaultAsync(); 

    public async Task<Agendamento[]> GetAllAgendamentosByPetShopIdDataAgendamentoAsync(int petShopId, DateTime dataAgendamento)
    {
        return await _context.Agendamentos.Where(p => p.PetShopId == petShopId && p.DataAgendamento == dataAgendamento)
                     .OrderBy(p => p.HorarioMarcado)
                     .ToArrayAsync();
    }

    public async Task<int[]> GetAllDiasComAgendamentosByPetShopIdMesAsync(int petShopId, int mes)
    {
        return await _context.Agendamentos.Where(a => a.PetShopId == petShopId && a.DataAgendamento.Month == mes)
                                  .Select(a => a.DataAgendamento.Day)
                                  .Distinct()
                                  .ToArrayAsync();
    }

    public async Task<string[]> GetAllHorariosDisponiveisByPetShopIdDataAgendamentoAsync(int petShopId, DateTime dataAgendamento)
    {
        string[] horariosDisponiveis = { "8:00 - 9:00",
                                         "9:00 - 10:00",
                                         "10:00 - 11:00",
                                         "11:00 - 12:00",
                                         "13:00 - 14:00",
                                         "14:00 - 15:00",
                                         "15:00 - 16:00",
                                         "16:00 - 17:00",
                                       };

        string[] horariosMarcados = await _context.Agendamentos.Where(a => a.PetShopId == petShopId && a.DataAgendamento.Date == dataAgendamento)
                                  .Select(a => a.HorarioMarcado)
                                  .Distinct()
                                  .ToArrayAsync();

        return horariosDisponiveis.Except(horariosMarcados).ToArray();
    }

    public Informativo GetInformativosPetShop(int petShopId, DateTime dataAgendamento)
    {
        IQueryable<Agendamento> queryAgendamentos = _context.Agendamentos;
        IQueryable<Cliente> queryClientes = _context.Clientes;
        IQueryable<Servico> queryServicos = _context.Servicos;

        _primeiroDiaDoMes = new(dataAgendamento.Year, dataAgendamento.Month, 1);
        _ultimoDiaDoMes = _primeiroDiaDoMes.AddMonths(1).AddDays(-1);

        return new()
        {
            TotalAgendamentos = queryAgendamentos.Where(a => a.PetShopId == petShopId
                                                          && a.DataAgendamento >= _primeiroDiaDoMes
                                                          && a.DataAgendamento <= _ultimoDiaDoMes)
                                                 .Distinct()
                                                 .Count(),

            PorcentagemAgendamentos = GetPorcentagemAgendamentos(ref queryAgendamentos, petShopId, dataAgendamento),

            TotalRendimentos = queryAgendamentos.Include(a => a.Servico)
                                                             .Where(a => a.PetShopId == petShopId
                                                                      && a.DataAgendamento >= _primeiroDiaDoMes
                                                                      && a.DataAgendamento <= _ultimoDiaDoMes)
                                                             .ToList()
                                                             .Select(a => a.Servico!.Preco)
                                                             .Sum(),

            PorcentagemRendimentos = GetPorcentagemRendimentos(ref queryAgendamentos, petShopId, dataAgendamento),


            TotalClientes = queryClientes.Where(c => c.PetShopId == petShopId
                                                  && c.DataCriacao >= _primeiroDiaDoMes
                                                  && c.DataCriacao <= _ultimoDiaDoMes)
                                         .Distinct()
                                         .Count(),

            PorcentagemClientes = GetPorcentagemClientes(ref queryClientes, petShopId, dataAgendamento),

            TotalServicos = queryServicos.Where(s => s.PetShopId == petShopId
                                                  && s.DataCriacao >= _primeiroDiaDoMes
                                                  && s.DataCriacao <= _ultimoDiaDoMes)
                                         .Distinct()
                                         .Count(),

            PorcentagemServicos = GetPorcentagemServicos(ref queryServicos, petShopId, dataAgendamento)
        };
    }

    #region PorcentagensInformativos

    private string GetPorcentagemAgendamentos(ref IQueryable<Agendamento> queryAgendamentos, int petShopId, DateTime dataAgendamento)
    {
        int totalAgendamentosNoMesPassado = queryAgendamentos.Where(a => a.PetShopId == petShopId
                                                                      && a.DataAgendamento >= dataAgendamento.AddMonths(-1).AddDays(1 - dataAgendamento.Day)
                                                                      && a.DataAgendamento < dataAgendamento.AddDays(-dataAgendamento.Day))
                                                             .Distinct()
                                                             .Count();

        int totalAgendamentosNoMesAtual = queryAgendamentos.Where(a => a.PetShopId == petShopId
                                                                    && a.DataAgendamento >= _primeiroDiaDoMes
                                                                    && a.DataAgendamento <= _ultimoDiaDoMes)
                                                           .Distinct()
                                                           .Count();

        if (totalAgendamentosNoMesPassado == 0)
            return "+0,00%";

        double porcentagemAgendamentos = (totalAgendamentosNoMesAtual - totalAgendamentosNoMesPassado) / (double)totalAgendamentosNoMesPassado * 100;

        return porcentagemAgendamentos >= 0 ? $"+{porcentagemAgendamentos:N2}%" : $"{porcentagemAgendamentos:N2}%";
    }

    private string GetPorcentagemRendimentos(ref IQueryable<Agendamento> queryAgendamentos, int petShopId, DateTime dataAgendamento)
    {
        List<Agendamento> agendamentosNoMesPassado = queryAgendamentos.Include(a => a.Servico)
                                                                      .Where(a => a.PetShopId == petShopId
                                                                          && a.DataAgendamento >= dataAgendamento.AddMonths(-1).AddDays(1 - dataAgendamento.Day)
                                                                          && a.DataAgendamento < dataAgendamento.AddDays(-dataAgendamento.Day))
                                                                      .ToList();

        List<Agendamento> agendamentosNoMesAtual = queryAgendamentos.Include(a => a.Servico)
                                                                    .Where(a => a.PetShopId == petShopId
                                                                             && a.DataAgendamento >= _primeiroDiaDoMes
                                                                             && a.DataAgendamento <= _ultimoDiaDoMes)
                                                                    .ToList();

        decimal totalRendimentosNoMesPassado = agendamentosNoMesPassado.Select(a => a.Servico!.Preco)
                                                                       .Sum();

        decimal totalRendimentosNoMesAtual = agendamentosNoMesAtual.Select(a => a.Servico!.Preco)
                                                                   .Sum();

        if (totalRendimentosNoMesAtual == 0)
            return "+0,00%";

        double porcentagemRendimentos = Convert.ToDouble((totalRendimentosNoMesAtual - totalRendimentosNoMesPassado) / totalRendimentosNoMesAtual) * 100;

        return porcentagemRendimentos >= 0 ? $"+{porcentagemRendimentos:N2}%" : $"{porcentagemRendimentos:N2}%";
    }

    private string GetPorcentagemClientes(ref IQueryable<Cliente> queryClientes, int petShopId, DateTime dataAgendamento)
    {
        int totalClientesNoMesPassado = queryClientes.Where(c => c.PetShopId == petShopId
                                                              && c.DataCriacao >= dataAgendamento.AddMonths(-1).AddDays(1 - dataAgendamento.Day)
                                                              && c.DataCriacao < dataAgendamento.AddDays(-dataAgendamento.Day))
                                                     .Distinct()
                                                     .Count();

        int totalClientesNoMesAtual = queryClientes.Where(c => c.PetShopId == petShopId
                                                            && c.DataCriacao >= _primeiroDiaDoMes
                                                            && c.DataCriacao <= _ultimoDiaDoMes)
                                                   .Distinct()
                                                   .Count();

        if (totalClientesNoMesAtual == 0)
            return "+0%";

        double porcentagemClientes = ((totalClientesNoMesAtual - totalClientesNoMesPassado) / (double)totalClientesNoMesAtual) * 100;

        return porcentagemClientes >= 0 ? $"+{porcentagemClientes:N2}%" : $"-{porcentagemClientes:N2}%";
    }

    private string GetPorcentagemServicos(ref IQueryable<Servico> queryServicos, int petShopId, DateTime dataAgendamento)
    {
        int totalServicosNoMesPassado = queryServicos.Where(s => s.PetShopId == petShopId
                                                              && s.DataCriacao >= dataAgendamento.AddMonths(-1).AddDays(1 - dataAgendamento.Day)
                                                              && s.DataCriacao < dataAgendamento.AddDays(-dataAgendamento.Day))
                                                     .Distinct()
                                                     .Count();

        int totalServicosNoMesAtual = queryServicos.Where(s => s.PetShopId == petShopId
                                                            && s.DataCriacao >= _primeiroDiaDoMes
                                                            && s.DataCriacao <= _ultimoDiaDoMes)
                                                   .Distinct()
                                                   .Count();

        if (totalServicosNoMesAtual == 0)
            return "+0,00%";

        double porcentagemServicos = ((totalServicosNoMesAtual - totalServicosNoMesPassado) / (double)totalServicosNoMesAtual) * 100;

        return porcentagemServicos >= 0 ? $"+{porcentagemServicos:N2}%" : $"{porcentagemServicos:N2}%";
    }

    #endregion
}