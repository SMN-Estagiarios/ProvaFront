namespace ProvaFront.Dtos.Financeiro;

public class DashboardResumoDto
{
    public decimal TotalEntradas { get; set; }
    public decimal TotalSaidas { get; set; }
    public decimal Saldo { get; set; }
    public int QuantidadePendentes { get; set; }
}
