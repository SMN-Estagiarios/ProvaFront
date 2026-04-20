import $ from 'components/jquery';
import './loading.less';

export default class Loading {

    static show(message?: string) {
        var loadingContainer = $('body > .loading-container');
        if (!loadingContainer.length) {
            loadingContainer = $('<div class="loading-container"/>');
            loadingContainer.html('<div uk-spinner="ratio: 3"></div>');
            loadingContainer.append('<div class="content-message"></div>');
            $('body').prepend(loadingContainer);
        }

        Loading.updateMessage(message || '');
        loadingContainer.fadeIn(200);
    }

    static hide() {
        if ($(document).data('manual') !== true)
            $('body > .loading-container').fadeOut(200);

        $(document).data('manual', false);
    };

    static ignoreNextAjaxLoading = function (manual) {
        $(document).data('showLoading', false);
        $(document).data('manual', manual || false);
    };

    static updateMessage(message) {
        $('body > .loading-container').find('.content-message').html(message || '');
    };
}
