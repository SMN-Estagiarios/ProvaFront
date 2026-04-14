using Microsoft.AspNetCore.Mvc;

namespace ProvaFront.Controllers;

public class AuxiliarController : Controller
{
    public async Task<IActionResult> IndexAsync()
    {
        return View("Index");
    }

    public async Task<IActionResult> ModalCadastroAsync()
    {
        return PartialView("_ModalCadastro");
    }
}
