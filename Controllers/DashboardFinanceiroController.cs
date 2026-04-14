using Microsoft.AspNetCore.Mvc;
using ProvaFront.Interfaces.Services;

namespace ProvaFront.Controllers;

[Route("dashboard")]
public class DashboardFinanceiroController(IDashboardFinanceiroService dashboardService) : Controller
{
    [HttpGet("")]
    public IActionResult Index() => View();

    [HttpGet("resumo")]
    public async Task<IActionResult> Resumo(int? mes, int? ano)
    {
        var data = await dashboardService.ObterResumoAsync(mes, ano);
        return Ok(data);
    }

    [HttpGet("proximos-vencimentos")]
    public async Task<IActionResult> ProximosVencimentos(int quantidade = 5)
    {
        var data = await dashboardService.ObterProximosVencimentosAsync(quantidade);
        return Ok(data);
    }
}
