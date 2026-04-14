using Microsoft.AspNetCore.Mvc;
using ProvaFront.Dtos.Financeiro;
using ProvaFront.Interfaces.Services;

namespace ProvaFront.Controllers;

[Route("cadastros/categorias")]
public class CategoriasController(ICategoriaFinanceiraService categoriaService) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Listar()
    {
        var itens = await categoriaService.ListarAsync();
        return Ok(itens);
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar(short id)
    {
        try
        {
            var item = await categoriaService.BuscarPorIdAsync(id);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("cadastrar")]
    public async Task<IActionResult> Cadastrar([FromBody] CategoriaDto dto)
    {
        try
        {
            var item = await categoriaService.CadastrarAsync(dto);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("editar")]
    public async Task<IActionResult> Editar([FromBody] CategoriaDto dto)
    {
        try
        {
            var item = await categoriaService.EditarAsync(dto);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("excluir")]
    public async Task<IActionResult> Excluir(short id)
    {
        try
        {
            await categoriaService.ExcluirAsync(id);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
