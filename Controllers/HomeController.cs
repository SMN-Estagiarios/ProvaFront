using Microsoft.AspNetCore.Mvc;

namespace ProvaFront.Controllers;

public class HomeController : Controller
{
    public async Task<IActionResult> IndexAsync()
    {
        return await Task.FromResult(View("Index"));
    }

    public IActionResult ResumoNotasPartial()
    {
        return PartialView("_ResumoNotas");
    }
}
