using ProvaFront.Dtos.Financeiro;
using ProvaFront.Interfaces.Services;
using ProvaFront.Models;

namespace ProvaFront.Services;

public class CategoriaFinanceiraService(FinanceiroMemoriaStore store) : ICategoriaFinanceiraService
{
    public Task<IReadOnlyList<CategoriaDto>> ListarAsync()
    {
        lock (store.SyncRoot)
        {
            var itens = store.Categorias
                .OrderBy(x => x.Nome)
                .Select(Map)
                .ToList();

            return Task.FromResult((IReadOnlyList<CategoriaDto>)itens);
        }
    }

    public Task<CategoriaDto> BuscarPorIdAsync(short id)
    {
        lock (store.SyncRoot)
        {
            var item = store.Categorias.FirstOrDefault(x => x.Id == id)
                ?? throw new InvalidOperationException("Categoria nao encontrada.");

            return Task.FromResult(Map(item));
        }
    }

    public Task<CategoriaDto> CadastrarAsync(CategoriaDto dto)
    {
        ValidarNome(dto.Nome);

        lock (store.SyncRoot)
        {
            if (store.Categorias.Any(x => x.Nome.Equals(dto.Nome.Trim(), StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException("Ja existe uma categoria com este nome.");

            var nova = new CategoriaFinanceira
            {
                Id = store.NextCategoriaId(),
                Nome = dto.Nome.Trim(),
                Cor = string.IsNullOrWhiteSpace(dto.Cor) ? "#3b82f6" : dto.Cor.Trim()
            };

            store.Categorias.Add(nova);
            return Task.FromResult(Map(nova));
        }
    }

    public Task<CategoriaDto> EditarAsync(CategoriaDto dto)
    {
        ValidarNome(dto.Nome);

        lock (store.SyncRoot)
        {
            var item = store.Categorias.FirstOrDefault(x => x.Id == dto.Id)
                ?? throw new InvalidOperationException("Categoria nao encontrada.");

            if (store.Categorias.Any(x => x.Id != dto.Id && x.Nome.Equals(dto.Nome.Trim(), StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException("Ja existe uma categoria com este nome.");

            item.Nome = dto.Nome.Trim();
            item.Cor = string.IsNullOrWhiteSpace(dto.Cor) ? item.Cor : dto.Cor.Trim();

            return Task.FromResult(Map(item));
        }
    }

    public Task ExcluirAsync(short id)
    {
        lock (store.SyncRoot)
        {
            var item = store.Categorias.FirstOrDefault(x => x.Id == id)
                ?? throw new InvalidOperationException("Categoria nao encontrada.");

            if (store.Lancamentos.Any(x => x.CategoriaId == id))
                throw new InvalidOperationException("Nao e possivel excluir categoria com lancamentos vinculados.");

            store.Categorias.Remove(item);
            return Task.CompletedTask;
        }
    }

    private static void ValidarNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new InvalidOperationException("Nome da categoria e obrigatorio.");
    }

    private static CategoriaDto Map(CategoriaFinanceira model)
        => new()
        {
            Id = model.Id,
            Nome = model.Nome,
            Cor = model.Cor
        };
}
