using ProvaFront.Dtos.Financeiro;

namespace ProvaFront.Interfaces.Services;

public interface IContaFinanceiraService
{
    Task<IReadOnlyList<ContaDto>> ListarAsync();
    Task<ContaDto> BuscarPorIdAsync(short id);
    Task<ContaDto> CadastrarAsync(ContaDto dto);
    Task<ContaDto> EditarAsync(ContaDto dto);
    Task ExcluirAsync(short id);
}
