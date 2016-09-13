$(document).ready(function () {

    // on page load, show search page only
    $(".searchPage").show();
    $(".resultsPage").hide();

    // for Flickr API requests
    var flickr = new Flickr({
        api_key: "c194a02282be12c8a99712be3d2ca403", 
        secret: "3898222f4782f29e"
    });

    // global variables
    var searchStr, images, users, beforeDate, afterDate;
    var photos = {};
    var params = {
        per_page: 250,
        page: 0
    };

    // fetch and display original photo + Flickr user profile information
    var goToProfile = function (src, elem) {
        var id, i;
        for (i in photos) {
            if (photos[i].url === src) {
                id = photos[i].userId;
            }
        }
        flickr.urls.getUserProfile({"user_id": id}, function (err, response) {
            if (err) {
                console.log(err);
                $(".resultsContent").append("<div class=\"error\"><h3>Sorry! No results found. Please try a different search.</h3></div>");
                return false;
            } else {
                $(elem).append("<div class=\"caption\"><a target=\"_blank\" href=\"" + src + "\">Original photo</a><br><a target=\"_blank\" href=\"" + response.user.url + "\">User Profile</a></div>");
            }
        });
    };

    // search Flickr using parameters passed into function
    var flickrSearch = function (params) {
        var i, j, k, idx, url, append, counter;
        flickr.photos.search(params, function (err, result) {
            // if response is error, display error message and exit
            if (err) {
                console.log(err);
                $(".resultsContent").append("<div class=\"error\"><h3>Sorry! No results found. Please try a different search.</h3></div>");
                return false;
            } else {
                if (result.photos.photo.length === 0) {
                    $("#grid").hide();
                    $(".resultsContent").append("<div class=\"error\"><h3>Sorry! No results found. Please try a different search.</h3></div>");
                    $("#showMore").hide();
                    return false;
                }
                append = "";
                // construct URL to image for each photo in results
                for (idx = 0; idx < result.photos.photo.length; idx++) {
                    j = result.photos.photo[idx];
                    url = "";
                    url += "https://farm" + j.farm + ".staticflickr.com/" + j.server + "/" + j.id + "_" + j.secret + ".jpg";
                    photos[idx] = {"url": url, "userId": j.owner};
                }
                counter = 0;
                // display photos in groups of 10 (only one group will be shown at a time)
                for (i in photos) {
                    if ((counter % 10) === 0) {
                        append += "<div class=\"group\" id=\"group" + (i / 10) + "\"><div id=\"photo" + i + "\" class=\"photo\"><div class=\"thumbnail\" style=\"background-image:url(\'" + photos[i].url + "\');\"></div></div>";
                    }
                    else if ((counter % 10) === 9) {
                        append += "<div id=\"photo" + i + "\" class=\"photo\"><div class=\"thumbnail\" style=\"background-image:url(\'" + photos[i].url + "\');\"></div></div></div>";
                    }
                    else {
                        append += "<div id=\"photo" + i + "\" class=\"photo\"><div class=\"thumbnail\" style=\"background-image:url(\'" + photos[i].url + "\');\"></div></div>";
                    }
                    counter++;
                }
                // append the images to the document and show the appropriate group of 10 photos
                $("#grid").append(append);
                $("#grid").children().hide();
                $($("#grid").children()[0]).show();
                // now call function to display links to original photo and user profile
                for (k in photos) {
                    goToProfile(photos[k].url, $("#photo" + k));
                }
            }
        });
    };

    // parse the user's query and construct the API call parameters
    var enterSearch = function () {

        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        photos = {};

        // get search strings (regular image search, user search, before/after date search) from input boxes
        searchStr = $("#imageSearch").val();
        userStr = $("#userSearch").val();
        beforeDate = $("#beforeDate").val();
        afterDate = $("#afterDate").val();

        images = (searchStr.length > 1) ? true : false;
        users = (userStr.length > 1) ? true : false;

        // ensure valid search terms were entered
        if (!images && !users) {
            alert("Please enter a search query.");
            return;
        }
        if (afterDate && (afterDate.match(/^[1-2][0-9][0-9][0-9](-)[0-1][0-9](-)[0-3][0-9]$/) === null)) {
            alert("Please enter a valid date in the format yyyy-mm-dd (year-month-day).");
            return;
        }
        if (beforeDate && (beforeDate.match(/^[1-2][0-9][0-9][0-9](-)[0-1][0-9](-)[0-3][0-9]$/) === null)) {
            alert("Please enter a valid date in the format yyyy-mm-dd (year-month-day).");
            return;
        }
        if (afterDate && beforeDate && (beforeDate < afterDate)) {
            alert("Please enter a valid range of dates.");
            return;
        }

        // set parameters for Flickr API query
        if (images) {
            params["text"] = searchStr;
        }
        if (afterDate) {
            params["min_upload_date"] = afterDate;
        }
        if (beforeDate) {
            params["max_upload_date"] = beforeDate;
        }

        // hide the search page and display the gallery page, as results will be available soon
        $(".searchPage").hide(1000);
        $(".resultsPage").show(1000);

        // query the Flickr photo search API (after the findByUsername API, if a username was requested)
        if (users) {
            flickr.people.findByUsername({username: userStr}, function (err, result) {
                if (err) {
                    console.log(err);
                    params.page++;
                    flickrSearch(params);
                } else {
                    params["user_id"] = result.user.nsid;
                    params.page++;
                    flickrSearch(params);
                }
            });
        } else {
            params.page++;
            flickrSearch(params);
        }
    };

    // trigger a search on search button click or "enter" from any input field
    $("#searchButton").click(function () {
        enterSearch();
    });
    $("input").bind("keypress", function (e) {
        if (e.keyCode === 13) {
            enterSearch();
        }
    });

    // set and reset input box placeholder text, on focus in/out
    $("#imageSearch").focusin(function() {
        $(this).attr("placeholder", "");
    });
    $("#userSearch").focusin(function() {
        $(this).attr("placeholder", "");
    });
    $("#afterDate").focusin(function() {
        $(this).attr("placeholder", "");
    });
    $("#beforeDate").focusin(function() {
        $(this).attr("placeholder", "");
    });
    $("#imageSearch").focusout(function() {
        $(this).attr("placeholder", "Search images by title, tag, description...");
    });
    $("#userSearch").focusout(function() {
        $(this).attr("placeholder", "And/or search images by username...");
    });
    $("#afterDate").focusout(function() {
        $(this).attr("placeholder", "yyyy-mm-dd");
    });
    $("#beforeDate").focusout(function() {
        $(this).attr("placeholder", "yyyy-mm-dd");
    });

    // on back button click, clear API query parameters and hide previous photo results
    $("#backButton").click(function () {
        params.page = 0;
        delete params.text;
        delete params.user_id;
        delete params.min_upload_date;
        delete params.max_upload_date;
        $(".error").remove();
        $("#grid").children().remove();
        $(".resultsPage").hide(1000);
        $(".searchPage").show(1000);
    });

    // on show more button click, display the next 10 photos (or re-query the Flickr API, if none remain)
    $("#showMore").click(function () {
        if ($("#grid").children().length === 1) {
            $("#grid").children().remove();
            params.page++;
            flickrSearch(params);
        } else {
            $($("#grid").children()[0]).remove();
            $($("#grid").children()[0]).show();
        }
    });

    // on logo/header click, clear API query parameters and hide previous photo results
    $(".headerWrapper").click(function () {
        params.page = 0;
        delete params.text;
        delete params.user_id;
        delete params.min_upload_date;
        delete params.max_upload_date;
        $(".error").remove();
        $("#grid").children().remove();
        $(".resultsPage").hide(1000);
        $(".searchPage").show(1000);
    });

});
