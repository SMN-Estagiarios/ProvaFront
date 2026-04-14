using Microsoft.AspNetCore.Mvc;
using ProvaFront.Dtos.Financeiro;
using ProvaFront.Interfaces.Services;

namespace ProvaFront.Controllers;

[Route("cadastros/contas")]
public class ContasController(IContaFinanceiraService contaService) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Listar()
    {
        var itens = await contaService.ListarAsync();
        return Ok(itens);
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar(short id)
    {
        try
        {
            var item = await contaService.BuscarPorIdAsync(id);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("cadastrar")]
    public async Task<IActionResult> Cadastrar([FromBody] ContaDto dto)
    {
        try
        {
            var item = await contaService.CadastrarAsync(dto);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("editar")]
    public async Task<IActionResult> Editar([FromBody] ContaDto dto)
    {
        try
        {
            var item = await contaService.EditarAsync(dto);
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
            await contaService.ExcluirAsync(id);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
