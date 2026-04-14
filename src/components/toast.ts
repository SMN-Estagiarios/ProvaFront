import $ from 'jquery';
import iziToast, { IziToastPosition, IziToastSettings } from 'izitoast';
import 'izitoastcss';

export default class Toast {
    static show(type: string) {
        function showToast(message: string | JQuery.jqXHR<any>, timeout?: number, position?: IziToastPosition, params?: IziToastSettings) {

            iziToast[type]({
                message: message,
                timeout: timeout || 10000,
                position: position || 'bottomCenter',
                displayMode: 2,
                ...params
            });
        }

        return function (message: string | JQuery.jqXHR<any>, timeout?: number, position?: IziToastPosition, params?: IziToastSettings) {
            if (typeof message !== 'string' && 'responseText' in message) {
                if (message.responseText) {
                    if (message.responseText[0] !== '{' && message.responseText[0] !== '[')
                        showToast(message.responseText, timeout, position, params);
                    else {
                        const content = JSON.parse(message.responseText);

                        if (content.messages && content.messages.length > 0)
                            content.messages.forEach(msg => showToast(msg, timeout, position, params));
                    }
                }
            } else
                showToast(message, timeout, position, params);
        };
    }

    static updateMessage = function (message) {
        $('body > .loading-container').find('.content-message').html(message || '');
    };

    static info = Toast.show('info');
    static success = Toast.show('success');
    static warning = Toast.show('warning');
    static error = Toast.show('error');

    static clear() {
        iziToast.destroy();
    }
}
(Window as any).Toast = Toast;
