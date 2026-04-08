using ProvaFront.Enums;
using ProvaFront.Models;

namespace ProvaFront.Services;

public class FinanceiroMemoriaStore
{
    private readonly object _lock = new();
    private short _categoriaSeq = 1;
    private short _contaSeq = 1;
    private int _lancamentoSeq = 1;

    public object SyncRoot => _lock;
    public List<CategoriaFinanceira> Categorias { get; } = [];
    public List<ContaFinanceira> Contas { get; } = [];
    public List<LancamentoFinanceiro> Lancamentos { get; } = [];

    public FinanceiroMemoriaStore()
    {
        Seed();
    }

    public short NextCategoriaId() => _categoriaSeq++;
    public short NextContaId() => _contaSeq++;
    public int NextLancamentoId() => _lancamentoSeq++;

    private void Seed()
    {
        var categoriaAlimentacao = new CategoriaFinanceira { Id = NextCategoriaId(), Nome = "Alimentacao", Cor = "#f59e0b" };
        var categoriaMoradia = new CategoriaFinanceira { Id = NextCategoriaId(), Nome = "Moradia", Cor = "#ef4444" };
        var categoriaSalario = new CategoriaFinanceira { Id = NextCategoriaId(), Nome = "Salario", Cor = "#10b981" };
        var categoriaLazer = new CategoriaFinanceira { Id = NextCategoriaId(), Nome = "Lazer", Cor = "#3b82f6" };
        Categorias.AddRange([categoriaAlimentacao, categoriaMoradia, categoriaSalario, categoriaLazer]);

        var contaNubank = new ContaFinanceira { Id = NextContaId(), Nome = "Conta Nubank", Instituicao = "Nubank", Cor = "#8b5cf6" };
        var contaCarteira = new ContaFinanceira { Id = NextContaId(), Nome = "Carteira", Instituicao = "Dinheiro", Cor = "#111827" };
        Contas.AddRange([contaNubank, contaCarteira]);

        var hoje = DateOnly.FromDateTime(DateTime.Now);

        Lancamentos.AddRange([
            new LancamentoFinanceiro
            {
                Id = NextLancamentoId(),
                Descricao = "Salario mensal",
                Valor = 5200m,
                DataCompetencia = new DateOnly(hoje.Year, hoje.Month, 5),
                Tipo = TipoLancamentoEnum.Entrada,
                CategoriaId = categoriaSalario.Id,
                ContaId = contaNubank.Id,
                Pago = true,
                Observacao = "Pagamento empresa"
            },
            new LancamentoFinanceiro
            {
                Id = NextLancamentoId(),
                Descricao = "Mercado",
                Valor = 450m,
                DataCompetencia = new DateOnly(hoje.Year, hoje.Month, 12),
                Tipo = TipoLancamentoEnum.Saida,
                CategoriaId = categoriaAlimentacao.Id,
                ContaId = contaNubank.Id,
                Pago = true,
                Observacao = "Compras da semana"
            },
            new LancamentoFinanceiro
            {
                Id = NextLancamentoId(),
                Descricao = "Aluguel",
                Valor = 1700m,
                DataCompetencia = new DateOnly(hoje.Year, hoje.Month, 10),
                Tipo = TipoLancamentoEnum.Saida,
                CategoriaId = categoriaMoradia.Id,
                ContaId = contaNubank.Id,
                Pago = true,
                Observacao = "Apartamento"
            },
            new LancamentoFinanceiro
            {
                Id = NextLancamentoId(),
                Descricao = "Cinema",
                Valor = 90m,
                DataCompetencia = hoje.AddDays(5),
                Tipo = TipoLancamentoEnum.Saida,
                CategoriaId = categoriaLazer.Id,
                ContaId = contaCarteira.Id,
                Pago = false,
                Observacao = "Sessao final de semana"
            }
        ]);
    }
}
