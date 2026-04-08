import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export default class Toast {
    static success(msg: string) {
        iziToast.success({ message: msg });
    }
    static error(msg: string) {
        iziToast.error({ message: msg });
    }
}

(window as any).Toast = Toast;
