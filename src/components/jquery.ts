import $ from 'jquery';
import Loading from './loading';

$.ajaxSetup({ cache: false });

$.postFormData = function(url: string, formData: FormData) {
	return $.ajax({
		url: url,
		method: 'POST',
		data: formData,
		processData: false,
		contentType: false,
	});
};

['put', 'delete'].forEach(function (type) {
	$[type] = function (url, data) {
		return $.ajax({
			url: url,
			type: type.toUpperCase(),
			data: data ? JSON.stringify(data) : undefined,
			contentType: 'application/json'
		});
	};
});

$(document).ajaxStart(function () {
	let loading = $(document).data('showLoading') !== false;
	if (loading)
		Loading.show();
	$(document).data('showLoading', true);
}).ajaxStop(function () {
	Loading.hide();
});

export default $;
