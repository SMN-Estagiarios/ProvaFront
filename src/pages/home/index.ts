import "styles/index.less";
import Toast from "components/toast";

interface IModelHome {
    message?: string;
}

let model: IModelHome;

export function init(params: IModelHome) {
    model = params;
    console.log("Home init", model);
    if (model.message) Toast.success(model.message);
}

export default { init };
