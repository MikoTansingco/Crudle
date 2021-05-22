$(document).ready(function () {
    $(`#username`).keyup(function () {
        // your code here
		var username = $(`#username`).val();
		
		console.log(username);
		$.get(`/checkUsername`, {username: username}, function(result) {
			console.log(result);
			if(result.username == username) {
				$(`#username`).css(`background-color`, `red`);
				$(`#error`).text(`Username already taken`);
				$(`#save`).prop(`disabled`, true);
			}
			else {
				$(`#username`).css(`background-color`, `#f1f1f1`);
				$(`#error`).text(``);
				$(`#save`).prop(`disabled`, false);
			}
		});
    });
})