import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";

UIkit.use(Icons);

(window as any).UIkit = UIkit;

UIkit.notification("UIkit inicializado com sucesso!", { status: "primary" });
