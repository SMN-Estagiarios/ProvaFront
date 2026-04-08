import "styles/index.less";
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import toast from 'components/toast';

UIkit.use(Icons);

interface IModelHome {
    urls: {
        index: string;
        partial: string;
    };
}

let model: IModelHome;

export function init(params: IModelHome) {
    model = params;
}

export {toast}
