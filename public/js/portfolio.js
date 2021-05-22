$(document).ready(function () {
    $(`#post`).click(function () {
        var title = $(`#title`).val();
        var desc = $(`#desc`).val();
        var stars = $(`#stars`).val();

        $.get(`/postreview`, {title: title, desc: desc, stars: stars}, function(result)
		{
            $(`#reviews`).append(result);
        });
		
		$(`#desc`).val(``);
        $(`#stars`).val(1);
    });
})