$(document).ready(function () {
    $(`#title`).keyup(function () {
		var title = $(`#title`).val();
		
		$.get(`/checkTitle`, {title: title}, function(result) {
			if(result.title == title) {
				$(`#title`).css(`border-color`, `red`);
				$(`#error`).text(`Title already taken`);
				$(`#edit`).prop(`disabled`, true);
			}
			else {
				$(`#title`).css(`border-color`, ``);
				$(`#error`).text(``);
				$(`#edit`).prop(`disabled`, false);
			}
		});
    });
})