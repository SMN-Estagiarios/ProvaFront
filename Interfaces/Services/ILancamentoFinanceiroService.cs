using ProvaFront.Dtos.Financeiro;

namespace ProvaFront.Interfaces.Services;

public interface ILancamentoFinanceiroService
{
    Task<IReadOnlyList<LancamentoDto>> ListarAsync(FiltroLancamentoDto filtros);
    Task<LancamentoDto> BuscarPorIdAsync(int id);
    Task<LancamentoDto> CadastrarAsync(LancamentoDto dto);
    Task<LancamentoDto> EditarAsync(LancamentoDto dto);
    Task ExcluirAsync(int id);
}
