﻿using Microsoft.EntityFrameworkCore;
using PetHelper.Domain;
using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;
namespace PetHelper.Persistence;

public class ClientePersist : IClientePersist
{
    private readonly PetHelperContext _context;

    public ClientePersist(PetHelperContext context)
    {
        _context = context;
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    public async Task<Cliente[]> GetAllClientesByPetShopIdAsync(int petShopId)
    {
        IQueryable<Cliente> query = _context.Clientes;

        return await query.Where(p => p.PetShopId == petShopId)
                     .OrderBy(p => p.Nome)
                     .ToArrayAsync();
    }

    public async Task<Cliente?> GetClienteByIdAsync(int clienteId)
    {
        IQueryable<Cliente> query = _context.Clientes;

        return await query.Where(p => p.Id == clienteId)
                          .FirstOrDefaultAsync();
    }
}
