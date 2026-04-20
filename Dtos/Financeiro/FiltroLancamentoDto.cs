using ProvaFront.Enums;

namespace ProvaFront.Dtos.Financeiro;

public class FiltroLancamentoDto
{
    public string TermoBusca { get; set; }
    public int? Mes { get; set; }
    public int? Ano { get; set; }
    public TipoLancamentoEnum? Tipo { get; set; }
    public short? CategoriaId { get; set; }
    public short? ContaId { get; set; }
    public bool? Pago { get; set; }
}
