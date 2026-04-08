namespace ProvaFront.Extensions;

public static class NomeController
{
    public static string ControllerName(this string controllerName)
    {
        if (!controllerName.EndsWith("Controller") || controllerName == "Controller")
            throw new ArgumentException($"{controllerName} is not a valid name for a Controller class");

        return controllerName.Substring(0, controllerName.LastIndexOf("Controller"));
    }

    public static string ActionName(this string actionName)
    {
        if (!actionName.EndsWith("Async"))
            return actionName;

        return actionName.Substring(0, actionName.IndexOf("Async"));
    }
}
