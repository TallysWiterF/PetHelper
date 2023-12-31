﻿namespace PetHelper.Domain;

public class Cliente : IEntidadeBase
{
    public int Id { get; set; }
    public int PetShopId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Complemento { get; set; } = string.Empty;
    public List<Pet> Pets { get; set; } = new List<Pet>();
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }

    public bool Equals(Cliente cliente) => Id == cliente.Id &&
                                           PetShopId == cliente.PetShopId &&
                                           Nome == cliente.Nome.Trim() &&
                                           Telefone == cliente.Telefone &&
                                           Endereco == cliente.Endereco.Trim() &&
                                           Complemento == cliente.Complemento.Trim() &&
                                           Pets == cliente.Pets;
}
