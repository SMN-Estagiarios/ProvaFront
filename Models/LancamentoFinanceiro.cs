using ProvaFront.Enums;

namespace ProvaFront.Models;

public class LancamentoFinanceiro
{
    public int Id { get; set; }
    public string Descricao { get; set; }
    public decimal Valor { get; set; }
    public DateOnly DataCompetencia { get; set; }
    public TipoLancamentoEnum Tipo { get; set; }
    public short CategoriaId { get; set; }
    public short ContaId { get; set; }
    public bool Pago { get; set; }
    public string Observacao { get; set; }
}
