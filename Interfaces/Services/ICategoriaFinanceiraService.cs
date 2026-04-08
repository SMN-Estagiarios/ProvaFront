using ProvaFront.Dtos.Financeiro;

namespace ProvaFront.Interfaces.Services;

public interface ICategoriaFinanceiraService
{
    Task<IReadOnlyList<CategoriaDto>> ListarAsync();
    Task<CategoriaDto> BuscarPorIdAsync(short id);
    Task<CategoriaDto> CadastrarAsync(CategoriaDto dto);
    Task<CategoriaDto> EditarAsync(CategoriaDto dto);
    Task ExcluirAsync(short id);
}
