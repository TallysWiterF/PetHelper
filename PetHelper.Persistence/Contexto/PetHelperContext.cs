using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;

namespace PetHelper.Persistence.Contexto;

public class PetHelperContext : DbContext
{
    public PetHelperContext(DbContextOptions<PetHelperContext> options) : base(options) { }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<PetShop> PetShops { get; set; }
    public DbSet<Servico> Servicos { get; set; }
    public DbSet<Agendamento> Agendamentos { get; set; }
    public DbSet<Pet> Pets { get; set; }
}
