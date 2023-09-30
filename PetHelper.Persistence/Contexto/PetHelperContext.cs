using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;

namespace PetHelper.Persistence.Contexto;

public class PetHelperContext : DbContext
{
    public PetHelperContext(DbContextOptions<PetHelperContext> options) : base(options) { }
    public DbSet<Agenda> Agendas { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<PetShop> PetShops { get; set; }
    public DbSet<Servico> Servicos { get; set; }
    public DbSet<Agendamento> Agendamentos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Agendamento>().HasKey(x => new { x.AgendamentoId, x.PetShopId, x.ClienteId, x.ServicoId });
    }
}
