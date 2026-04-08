using ProvaFront.Dtos.Financeiro;
using ProvaFront.Enums;
using ProvaFront.Interfaces.Services;
using ProvaFront.Models;

namespace ProvaFront.Services;

public class LancamentoFinanceiroService(FinanceiroMemoriaStore store) : ILancamentoFinanceiroService
{
    public Task<IReadOnlyList<LancamentoDto>> ListarAsync(FiltroLancamentoDto filtros)
    {
        filtros ??= new FiltroLancamentoDto();

        lock (store.SyncRoot)
        {
            IEnumerable<LancamentoFinanceiro> query = store.Lancamentos;

            if (!string.IsNullOrWhiteSpace(filtros.TermoBusca))
            {
                var termo = filtros.TermoBusca.Trim();
                query = query.Where(x => x.Descricao.Contains(termo, StringComparison.OrdinalIgnoreCase));
            }

            if (filtros.Mes.HasValue)
                query = query.Where(x => x.DataCompetencia.Month == filtros.Mes.Value);

            if (filtros.Ano.HasValue)
                query = query.Where(x => x.DataCompetencia.Year == filtros.Ano.Value);

            if (filtros.Tipo.HasValue)
                query = query.Where(x => x.Tipo == filtros.Tipo.Value);

            if (filtros.CategoriaId.HasValue)
                query = query.Where(x => x.CategoriaId == filtros.CategoriaId.Value);

            if (filtros.ContaId.HasValue)
                query = query.Where(x => x.ContaId == filtros.ContaId.Value);

            if (filtros.Pago.HasValue)
                query = query.Where(x => x.Pago == filtros.Pago.Value);

            var itens = query
                .OrderByDescending(x => x.DataCompetencia)
                .ThenByDescending(x => x.Id)
                .Select(Map)
                .ToList();

            return Task.FromResult((IReadOnlyList<LancamentoDto>)itens);
        }
    }

    public Task<LancamentoDto> BuscarPorIdAsync(int id)
    {
        lock (store.SyncRoot)
        {
            var item = store.Lancamentos.FirstOrDefault(x => x.Id == id)
                ?? throw new InvalidOperationException("Lancamento nao encontrado.");

            return Task.FromResult(Map(item));
        }
    }

    public Task<LancamentoDto> CadastrarAsync(LancamentoDto dto)
    {
        Validar(dto);

        lock (store.SyncRoot)
        {
            GarantirRelacionamentos(dto);

            var item = new LancamentoFinanceiro
            {
                Id = store.NextLancamentoId(),
                Descricao = dto.Descricao.Trim(),
                Valor = dto.Valor,
                DataCompetencia = dto.DataCompetencia,
                Tipo = dto.Tipo,
                CategoriaId = dto.CategoriaId,
                ContaId = dto.ContaId,
                Pago = dto.Pago,
                Observacao = dto.Observacao?.Trim() ?? string.Empty,
            };

            store.Lancamentos.Add(item);
            return Task.FromResult(Map(item));
        }
    }

    public Task<LancamentoDto> EditarAsync(LancamentoDto dto)
    {
        Validar(dto);

        lock (store.SyncRoot)
        {
            var item = store.Lancamentos.FirstOrDefault(x => x.Id == dto.Id)
                ?? throw new InvalidOperationException("Lancamento nao encontrado.");

            GarantirRelacionamentos(dto);

            item.Descricao = dto.Descricao.Trim();
            item.Valor = dto.Valor;
            item.DataCompetencia = dto.DataCompetencia;
            item.Tipo = dto.Tipo;
            item.CategoriaId = dto.CategoriaId;
            item.ContaId = dto.ContaId;
            item.Pago = dto.Pago;
            item.Observacao = dto.Observacao?.Trim() ?? string.Empty;

            return Task.FromResult(Map(item));
        }
    }

    public Task ExcluirAsync(int id)
    {
        lock (store.SyncRoot)
        {
            var item = store.Lancamentos.FirstOrDefault(x => x.Id == id)
                ?? throw new InvalidOperationException("Lancamento nao encontrado.");

            store.Lancamentos.Remove(item);
            return Task.CompletedTask;
        }
    }

    private void GarantirRelacionamentos(LancamentoDto dto)
    {
        if (!store.Categorias.Any(x => x.Id == dto.CategoriaId))
            throw new InvalidOperationException("Categoria informada nao existe.");

        if (!store.Contas.Any(x => x.Id == dto.ContaId))
            throw new InvalidOperationException("Conta informada nao existe.");
    }

    private static void Validar(LancamentoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Descricao))
            throw new InvalidOperationException("Descricao e obrigatoria.");

        if (dto.Valor <= 0)
            throw new InvalidOperationException("Valor deve ser maior que zero.");

        if (dto.CategoriaId <= 0)
            throw new InvalidOperationException("Categoria e obrigatoria.");

        if (dto.ContaId <= 0)
            throw new InvalidOperationException("Conta e obrigatoria.");

        if (!Enum.IsDefined(typeof(TipoLancamentoEnum), dto.Tipo))
            throw new InvalidOperationException("Tipo de lancamento invalido.");
    }

    private LancamentoDto Map(LancamentoFinanceiro model)
    {
        var categoria = store.Categorias.FirstOrDefault(x => x.Id == model.CategoriaId);
        var conta = store.Contas.FirstOrDefault(x => x.Id == model.ContaId);

        return new LancamentoDto
        {
            Id = model.Id,
            Descricao = model.Descricao,
            Valor = model.Valor,
            DataCompetencia = model.DataCompetencia,
            Tipo = model.Tipo,
            CategoriaId = model.CategoriaId,
            ContaId = model.ContaId,
            Pago = model.Pago,
            Observacao = model.Observacao,
            CategoriaNome = categoria?.Nome ?? string.Empty,
            ContaNome = conta?.Nome ?? string.Empty,
        };
    }
}
