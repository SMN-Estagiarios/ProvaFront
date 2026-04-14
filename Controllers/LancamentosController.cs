using Microsoft.AspNetCore.Mvc;
using ProvaFront.Dtos.Financeiro;
using ProvaFront.Interfaces.Services;

namespace ProvaFront.Controllers;

[Route("gestao/lancamentos")]
public class LancamentosController(ILancamentoFinanceiroService lancamentoService) : Controller
{
    [HttpGet("")]
    public IActionResult Index() => View();

    [HttpGet("api/listar")]
    public async Task<IActionResult> Listar([FromQuery] FiltroLancamentoDto filtros)
    {
        var itens = await lancamentoService.ListarAsync(filtros);
        return Ok(itens);
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar(int id)
    {
        try
        {
            var item = await lancamentoService.BuscarPorIdAsync(id);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("cadastrar")]
    public async Task<IActionResult> Cadastrar([FromBody] LancamentoDto dto)
    {
        try
        {
            var item = await lancamentoService.CadastrarAsync(dto);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("editar")]
    public async Task<IActionResult> Editar([FromBody] LancamentoDto dto)
    {
        try
        {
            var item = await lancamentoService.EditarAsync(dto);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("excluir")]
    public async Task<IActionResult> Excluir(int id)
    {
        try
        {
            await lancamentoService.ExcluirAsync(id);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("abrirModalNovoLancamento")]
    public IActionResult AbrirModalCadastro()
    {
        return PartialView("_ModalCadastro");
    }
}
