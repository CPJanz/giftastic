let topicArray = ["lol", "nope", "yikes", "bye"];
let favorites = [];

$(document).ready(function() {

    // Binds an event to clicking the search button and pressing the Enter key while the text field has focus.
    $("#search-button").click(function() {
        addNewSearchTopic();
    })
    document.onkeyup = function(event) {
        if (event.key === "Enter" && $("#search-text").is(":focus")) {
            addNewSearchTopic();
        }
    };

    // Grabs all of the favorite gif data stored in localStorage
    if (localStorage.getItem("favorites")) {
        favorites = JSON.parse(localStorage.getItem("favorites"));
    }

    // This applies to index.html
    populateTopicRow();

    // This applies to favorites.html
    populateFavorites();
})

// Adds search topic to the array of topics and re-generates the topic row
function addNewSearchTopic() {
    searchTerm = $("#search-text").val()
    if (searchTerm !== "") {
        $("#search-text").val("");
        topicArray.push(searchTerm);
        populateTopicRow();
        populateGifs(searchTerm);
    }
}

// Generate the topic row
function populateTopicRow() {
    $("#term-col").empty();
    $.each(topicArray, function(index, value) {
        $("#term-col").append(createTopicPill(value));
    })
}

// Create topic pill object and binds click event to it
function createTopicPill(topic) {
    let pill = $("<span>");
    pill.attr("class", "badge-pill badge-primary mx-1");
    pill.attr("id", topic + "-selector");
    pill.text(topic);
    pill.click(function() {
        populateGifs(topic);
    });
    return pill;
}

// Query giphy for the passed topic and uses the data to create the grid of gifs
function populateGifs(topic) {
    $("#image-div").empty();

    $.get("https://api.giphy.com/v1/gifs/search?api_key=HKArI6yPf1ZZtiXX9rT6dZi7egVUIgqU&q=" + topic + "&limit=12&rating=G&lang=en", function(response) {
        console.log(response);
        // Create 4 rows for images to live in
        for (let i = 0; i < 4; i++) {
            $($("#image-div")).append($("<div class='row' id='image-row-" + i + "'>"));
        }

        $.each(response.data,
            function(index, value) {
                //here we are limiting the number of images on a row to 3.
                let currentRow = $("#image-row-" + Math.floor(index / 3));
                // Creates an image object and appends it to the current row
                let currentCard = $(createImageCard({ stillImageURL: value.images.fixed_height_still.url, animatedImageURL: value.images.fixed_height.url, rating: value.rating, id: value.id }))
                currentRow.append(currentCard);
            }
        );

    });
}

// Creates the html object for an image card
function createImageCard(value) {
    // Wrapper Div
    let imageDiv = $("<div>");
    imageDiv.attr("class", "col col-lg-4 py-2 justify-content-center");

    // Top row contains the image
    let topRow = $("<div>");
    topRow.attr("class", "row");
    let topCol = $("<div>");
    topCol.attr("class", "col");
    let image = $("<img>");
    image.attr("src", value.stillImageURL);
    image.attr("state", "still");
    topCol.append(image);
    topRow.append(topCol);

    // Binds click even to the image which toggles between animated and still
    image.click(function() {
        let thisImage = $(this);
        if (thisImage.attr("state") === "still") {
            thisImage.attr("src", value.animatedImageURL);
            thisImage.attr("state", "animated");
        } else {
            thisImage.attr("src", value.stillImageURL);
            thisImage.attr("state", "still");
        }
    })

    // Bottom row contains the rating and favorite button
    let bottomRow = $("<div>");
    bottomRow.attr("class", "row");
    let bottomCol = $("<div>");
    bottomCol.attr("class", "col");
    let favoriteButton = $("<i>");
    let alreadyFavorited = false;
    let ratingSpan = $("<span>");
    ratingSpan.text("Rating: " + value.rating + " | ");
    ratingSpan.append(favoriteButton);
    bottomCol.append(ratingSpan);
    bottomRow.append(bottomCol);

    // Checks favorites array to see if the gif has already been favorited.
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].id === value.id) {
            alreadyFavorited = true;
        }
    }
    if (alreadyFavorited) {
        favoriteButton.attr("isFavorite", "true");
        favoriteButton.attr("class", "fas fa-heart");
    } else {
        favoriteButton.attr("isFavorite", "false");
        favoriteButton.attr("class", "far fa-heart");
    }

    // Binds a click event that toggles between favorited states (true/false).
    favoriteButton.click(function() {
        if (favoriteButton.attr("isFavorite") === "false") {
            favoriteButton.attr("isFavorite", "true");
            favoriteButton.attr("class", "fas fa-heart");
            addToFavorites(value.id, value.animatedImageURL, value.stillImageURL, value.rating);
        } else {
            favoriteButton.attr("isFavorite", "false")
            favoriteButton.attr("class", "far fa-heart");
            removeFromFavorites(value.id);
        }
    })

    // Appends top and bottom rows to the wrapper div
    imageDiv.append(topRow);
    imageDiv.append(bottomRow);

    return imageDiv;
}

// Populates the favorites page with favorited gifs
function populateFavorites() {
    console.log("favorites", favorites.length);
    for (let i = 0; i < favorites.length; i++) {
        $("#favorites-div").append(createImageCard(favorites[i]));
    }
}

// Adds image to favorites array and updates localStorage
function addToFavorites(imageId, animatedImageURL, stillImageURL, rating) {
    let newFavorite = true;
    console.log(favorites);
    $.each(favorites, function(index) {
        if (favorites[index].id === imageId) {
            newFavorite = false;
        }
    })
    if (newFavorite) {
        favorites.push({
            id: imageId,
            animatedImageURL: animatedImageURL,
            stillImageURL: stillImageURL,
            rating: rating
        });
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
}

// Removes image from favorites array and updates local storage
function removeFromFavorites(id) {
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].id === id) {
            favorites.splice(i, 1);
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
    }
}