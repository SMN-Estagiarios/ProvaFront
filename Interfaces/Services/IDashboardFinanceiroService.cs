using ProvaFront.Dtos.Financeiro;

namespace ProvaFront.Interfaces.Services;

public interface IDashboardFinanceiroService
{
    Task<DashboardResumoDto> ObterResumoAsync(int? mes, int? ano);
    Task<IReadOnlyList<ProximoVencimentoDto>> ObterProximosVencimentosAsync(int quantidade = 5);
}
