import "styles/index.less";
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import $ from "components/jquery";

UIkit.use(Icons);

export const init = () => {
    console.log('Categorias inicializada');
};

init();
