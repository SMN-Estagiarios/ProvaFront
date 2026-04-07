import "styles/index.less";
import Toast from "components/toast";

let model: IModelHome;

const home = {
    init: (params: IModelHome) => {
        model = params;
        console.log($("#teste").text());
        console.log("Home init", model);
        Toast.success("Home inicializada!");
    }
};

export default home;
