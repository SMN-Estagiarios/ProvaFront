namespace ProvaFront.Dtos.Financeiro;

public class ProximoVencimentoDto
{
    public int Id { get; set; }
    public string Descricao { get; set; }
    public decimal Valor { get; set; }
    public DateOnly DataCompetencia { get; set; }
    public string CategoriaNome { get; set; }
    public string ContaNome { get; set; }
}
