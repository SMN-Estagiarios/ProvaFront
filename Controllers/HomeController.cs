using Microsoft.AspNetCore.Mvc;

namespace ProvaFront.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
