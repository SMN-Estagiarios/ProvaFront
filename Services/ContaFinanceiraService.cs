using ProvaFront.Dtos.Financeiro;
using ProvaFront.Interfaces.Services;
using ProvaFront.Models;

namespace ProvaFront.Services;

public class ContaFinanceiraService(FinanceiroMemoriaStore store) : IContaFinanceiraService
{
    public Task<IReadOnlyList<ContaDto>> ListarAsync()
    {
        lock (store.SyncRoot)
        {
            var itens = store.Contas
                .OrderBy(x => x.Nome)
                .Select(Map)
                .ToList();

            return Task.FromResult((IReadOnlyList<ContaDto>)itens);
        }
    }

    public Task<ContaDto> BuscarPorIdAsync(short id)
    {
        lock (store.SyncRoot)
        {
            var item = store.Contas.FirstOrDefault(x => x.Id == id)
                ?? throw new InvalidOperationException("Conta nao encontrada.");

            return Task.FromResult(Map(item));
        }
    }

    public Task<ContaDto> CadastrarAsync(ContaDto dto)
    {
        Validar(dto);

        lock (store.SyncRoot)
        {
            if (store.Contas.Any(x => x.Nome.Equals(dto.Nome.Trim(), StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException("Ja existe uma conta com este nome.");

            var nova = new ContaFinanceira
            {
                Id = store.NextContaId(),
                Nome = dto.Nome.Trim(),
                Instituicao = string.IsNullOrWhiteSpace(dto.Instituicao) ? "Nao informado" : dto.Instituicao.Trim(),
                Cor = string.IsNullOrWhiteSpace(dto.Cor) ? "#0f766e" : dto.Cor.Trim(),
            };

            store.Contas.Add(nova);
            return Task.FromResult(Map(nova));
        }
    }

    public Task<ContaDto> EditarAsync(ContaDto dto)
    {
        Validar(dto);

        lock (store.SyncRoot)
        {
            var item = store.Contas.FirstOrDefault(x => x.Id == dto.Id)
                ?? throw new InvalidOperationException("Conta nao encontrada.");

            if (store.Contas.Any(x => x.Id != dto.Id && x.Nome.Equals(dto.Nome.Trim(), StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException("Ja existe uma conta com este nome.");

            item.Nome = dto.Nome.Trim();
            item.Instituicao = string.IsNullOrWhiteSpace(dto.Instituicao) ? item.Instituicao : dto.Instituicao.Trim();
            item.Cor = string.IsNullOrWhiteSpace(dto.Cor) ? item.Cor : dto.Cor.Trim();

            return Task.FromResult(Map(item));
        }
    }

    public Task ExcluirAsync(short id)
    {
        lock (store.SyncRoot)
        {
            var item = store.Contas.FirstOrDefault(x => x.Id == id)
                ?? throw new InvalidOperationException("Conta nao encontrada.");

            if (store.Lancamentos.Any(x => x.ContaId == id))
                throw new InvalidOperationException("Nao e possivel excluir conta com lancamentos vinculados.");

            store.Contas.Remove(item);
            return Task.CompletedTask;
        }
    }

    private static void Validar(ContaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            throw new InvalidOperationException("Nome da conta e obrigatorio.");
    }

    private static ContaDto Map(ContaFinanceira model)
        => new()
        {
            Id = model.Id,
            Nome = model.Nome,
            Instituicao = model.Instituicao,
            Cor = model.Cor,
        };
}
