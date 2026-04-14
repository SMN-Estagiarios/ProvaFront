using ProvaFront.Dtos.Financeiro;
using ProvaFront.Enums;
using ProvaFront.Interfaces.Services;

namespace ProvaFront.Services;

public class DashboardFinanceiroService(FinanceiroMemoriaStore store) : IDashboardFinanceiroService
{
    public Task<DashboardResumoDto> ObterResumoAsync(int? mes, int? ano)
    {
        var hoje = DateTime.Now;
        var mesRef = mes ?? hoje.Month;
        var anoRef = ano ?? hoje.Year;

        lock (store.SyncRoot)
        {
            var lancamentosPeriodo = store.Lancamentos
                .Where(x => x.DataCompetencia.Month == mesRef && x.DataCompetencia.Year == anoRef)
                .ToList();

            var entradas = lancamentosPeriodo
                .Where(x => x.Tipo == TipoLancamentoEnum.Entrada)
                .Sum(x => x.Valor);

            var saidas = lancamentosPeriodo
                .Where(x => x.Tipo == TipoLancamentoEnum.Saida)
                .Sum(x => x.Valor);

            var pendentes = lancamentosPeriodo.Count(x => !x.Pago);

            return Task.FromResult(new DashboardResumoDto
            {
                TotalEntradas = entradas,
                TotalSaidas = saidas,
                Saldo = entradas - saidas,
                QuantidadePendentes = pendentes,
            });
        }
    }

    public Task<IReadOnlyList<ProximoVencimentoDto>> ObterProximosVencimentosAsync(int quantidade = 5)
    {
        var hoje = DateOnly.FromDateTime(DateTime.Now);

        lock (store.SyncRoot)
        {
            var itens = store.Lancamentos
                .Where(x => x.Tipo == TipoLancamentoEnum.Saida && !x.Pago && x.DataCompetencia >= hoje)
                .OrderBy(x => x.DataCompetencia)
                .Take(quantidade)
                .Select(x => new ProximoVencimentoDto
                {
                    Id = x.Id,
                    Descricao = x.Descricao,
                    Valor = x.Valor,
                    DataCompetencia = x.DataCompetencia,
                    CategoriaNome = store.Categorias.FirstOrDefault(c => c.Id == x.CategoriaId)?.Nome ?? string.Empty,
                    ContaNome = store.Contas.FirstOrDefault(c => c.Id == x.ContaId)?.Nome ?? string.Empty,
                })
                .ToList();

            return Task.FromResult((IReadOnlyList<ProximoVencimentoDto>)itens);
        }
    }
}