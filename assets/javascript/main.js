let topicArray = ["lol", "pogchamp", "tyvm", "wowsers", "omg", "nope", "yikes"];



function populateTermRow() {
    $.each(topicArray, function(index, value) {
        $("#term-row").append($("<span class='badge-pill badge-primary mx-1' id='" + value + "-selector' > " + value + " </span>"));
        $("#" + value + "-selector").click(function() {
            populateGifs(value);
        });
    })
}

$(document).ready(function() {
    populateTermRow()
})

function populateGifs(topic) {
    $("#image-div").empty();

    $.get("https://api.giphy.com/v1/gifs/search?api_key=HKArI6yPf1ZZtiXX9rT6dZi7egVUIgqU&q=" + topic + "&limit=12&rating=G&lang=en", function(data) {

        //Create rows for images to live in
        for (let i = 0; i < 4; i++) {
            $($("#image-div")).append($("<div class='row py-2' id='image-row-" + i + "'>"));
        }

        $.each(data.data,
            function(index, value) {
                $("#image-row-" + Math.floor(index / 3)).append($("<div class='col col-lg-4 d-flex justify-content-center'><img src=" + value.images.fixed_height.url + " /></div>"));
            }
        );

    });
}