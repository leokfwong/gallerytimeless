function generateColorChart(id) {

    let idx = findIndexPainting(id);

    let chart = document.createElement("div");
    chart.id = "chart-container-" + id;
    chart.className = "chart-container";

    for (let i = 1; i < 257; i++) {

        let index;

        for (let j = 0; j < 256; j++) {
            if (colorsRGB[idx].order[j] == i) {
                index = j;
            }
        }

        let rgb = colorsRGB[idx].rgb[index];
        let color = document.createElement("div");
        color.id = "chart-pixel-color-" + i + "-" + id;
        color.className = "chart-pixel-color";
        color.style.background = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
        color.style.height = "12px";
        color.style.width = "12px";

        color.addEventListener("mouseover", function() {
            let div = document.getElementById("exhibit-rgb-" + id);

            let pixel = document.createElement("div");
            pixel.id = "selected-rgb-pixel";
            pixel.style.background = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
            pixel.style.height = "24px";
            pixel.style.width = "24px";

            let rgbValue = document.createElement("div");
            rgbValue.id = "selected-rgb-value";
            rgbValue.innerHTML = "<div>RGB: " + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + "</div>";

            div.appendChild(pixel);
            div.appendChild(rgbValue);
        });

        color.addEventListener("mouseout", function() {
            let div = document.getElementById("exhibit-rgb-" + id);
            div.innerHTML = "";
        });

        chart.appendChild(color);

    }

    return (chart);
}

function findIndexPainting(id) {

    for (let i = 0; i < colorsRGB.length; i++) {

        if (parseInt(colorsRGB[i].id) == id) {
            return (i);
        } else {
            //console.log("Error!! Couldn't find.");
        }

    }

}

/* Function retrieves dimensions of every painting upon load and assigns an orientation to it (landscape vs. portrait).
This is important since we want to resize images differently (height vs width).

@params {} none
@returns {} none */
function getPaintingDimensions() {

    // Iterate through all paintings in gallery_json
    for (let i = 0; i < gallery_json.length; i++) {

        // Create image object
        let img = new Image();

        // Define source of painting image (where to fetch image file) and data-id.
        img.setAttribute("data-src", "assets/images/paintings/" + gallery_json[i].year + "/" + gallery_json[i].id + "-min.png");
        img.setAttribute("data-id", gallery_json[i].id);

        // On image load
        img.onload = function() {

            // Get height and width of image
            let height = img.height;
            let width = img.width;
            let id = img.getAttribute("data-id");

            // Assign orientation based on dimensions
            gallery_json[parseInt(id) - 1].imgWidth = width;
            gallery_json[parseInt(id) - 1].imgHeight = height;
            if (height > width) {
                gallery_json[parseInt(id) - 1].orientation = "portrait";
            } else {
                gallery_json[parseInt(id) - 1].orientation = "landscape";
            }
        }
    }
}

//getPaintingDimensions();

var yearDictionary = [];

/* Set up document on page load. */
window.onload = function() {

    // Prevent scroll during transition from one painting to another
    document.body.classList.add("stop-scrolling");

    /* Function creates a section for each painting exhibit, which includes all the children divs.

    @params {} none
    @returns {} none */
    function createExhibits() {

        let previousYear = 2018;

        // Iterate through each painting, starting from the most recent
        for (let i = gallery_json.length - 1; i >= 0; i--) {

            // Create an exhibit for each
            let exhibit = document.createElement("div");
            exhibit.id = "exhibit-" + (i + 1);
            if (i == gallery_json.length - 1) {
                exhibit.className = "exhibit latest-exhibit";
            } else {
                exhibit.className = "exhibit";
            }
            exhibit.setAttribute("data-year", gallery_json[i].year);

            // Append exhibit to container and set up background image
            document.getElementById("exhibit-container").appendChild(exhibit);

            // Create overlay to dim background
            let overlay = document.createElement("div");
            overlay.id = "exhibit-overlay-" + (i + 1);
            overlay.className = "exhibit-overlay";
            exhibit.appendChild(overlay);

            // Create content div
            let content = document.createElement("div");
            content.id = "exhibit-content-" + (i + 1);
            content.className = "exhibit-content";
            exhibit.appendChild(content);

            // Create painting div
            let painting = document.createElement("div");
            painting.id = "exhibit-painting-" + (i + 1);

            content.appendChild(painting);
            painting.innerHTML = "<img data-src='assets/images/paintings/" + gallery_json[i].year + "/" + gallery_json[i].id + "-min.png' data-id='" + gallery_json[i].id + "' data-orientation='" + gallery_json[i].orientation + "'>";

            let enlarge = document.createElement("div");
            enlarge.className = "exhibit-painting-enlarge";
            painting.appendChild(enlarge);
            enlarge.innerHTML = "Click image to enlarge.";

            // Create painting overlay div
            let paintingOverlay = document.getElementById("painting-overlay");
            let largePainting = document.getElementById("exhibit-painting-large");

            let id = i;

            // When painting image clicked, show overlay with large painting
            painting.getElementsByTagName("img")[0].addEventListener("click", function() {

                console.log("Painting clicked");
                paintingOverlay.style.display = "flex";
                largePainting.innerHTML = "<img src='assets/images/paintings/" + gallery_json[id].year + "/" + gallery_json[id].id + "-min.png'>";
                let orientation;

                if (((window.innerHeight * 0.8) * gallery_json[id].imgWidth / gallery_json[id].imgHeight) > ((0.9) * window.innerWidth)) {
                    orientation = "landscape";
                } else {
                    orientation = "portrait";
                }

                largePainting.getElementsByTagName("img")[0].className = "exhibit-painting-large-img-" + orientation;

            });

            // Create description div
            let description = document.createElement("div");
            description.id = "exhibit-description-" + (i + 1);
            description.className = "exhibit-description";
            content.appendChild(description);

            let descriptionContent = document.createElement("div");
            descriptionContent.id = "exhibit-description-content-" + (i + 1);
            descriptionContent.className = "exhibit-description-content";
            description.appendChild(descriptionContent);

            // Create title div
            let title = document.createElement("div");
            title.id = "exhibit-title-" + (i + 1);
            title.className = "exhibit-title";
            descriptionContent.appendChild(title);
            title.innerHTML = gallery_json[i].title;

            // Create type div
            let type = document.createElement("div");
            type.id = "exhibit-type-" + (i + 1);
            type.className = "exhibit-type";
            descriptionContent.appendChild(type);
            type.innerHTML = gallery_json[i].type;

            // Create year div
            let year = document.createElement("div");
            year.id = "exhibit-year-" + (i + 1);
            year.className = "exhibit-year";
            descriptionContent.appendChild(year);
            year.innerHTML = gallery_json[i].year;

            // Create size div
            let size = document.createElement("div");
            size.id = "exhibit-size-" + (i + 1);
            size.className = "exhibit-size";
            descriptionContent.appendChild(size);
            size.innerHTML = gallery_json[i].size;

            // Create palette div
            let palette = document.createElement("div");
            palette.id = "exhibit-palette-" + (i + 1);
            palette.className = "exhibit-palette";
            palette.style.display = "flex";
            descriptionContent.appendChild(palette);

            // Iterate through palette and find the write id
            for (let i = 0; i < paletteRGB.length; i++) {

                if (parseInt(paletteRGB[i].id) == (id + 1)) {

                    // Iterate through each 5 clustered color
                    for (let y = 0; y < 5; y++) {

                        // Get RGB values
                        let red = paletteRGB[i].R[y];
                        let green = paletteRGB[i].G[y];
                        let blue = paletteRGB[i].B[y];

                        // Create div for each clustered color
                        let color = document.createElement("div");
                        color.id = "exhibit-palette-color-" + (y + 1);
                        color.className = "exhibit-palette-color";
                        color.style.width = "25px";
                        color.style.height = "25px";
                        color.style.background = "rgb(" + red + "," + green + "," + blue + ")";

                        palette.appendChild(color);

                    }
                }

            }

            // Create note div
            let note = document.createElement("div");
            note.id = "exhibit-note-" + (i + 1);
            note.className = "exhibit-note";
            descriptionContent.appendChild(note);
            //note.innerHTML = gallery_json[i].description;
            let chart = generateColorChart(i + 1);
            note.appendChild(chart);

            let rgb = document.createElement("div");
            rgb.id = "exhibit-rgb-" + (i + 1);
            rgb.className = "exhibit-rgb";
            descriptionContent.appendChild(rgb);

            let plot = document.createElement("div");
            plot.id = "exhibit-plot-" + (i + 1);
            plot.className = "exhibit-plot";
            descriptionContent.appendChild(plot);

            let showPlotButton = document.createElement("div");
            showPlotButton.id = "exhibit-plot-button-" + (i + 1);
            showPlotButton.className = "exhibit-plot-button";
            plot.appendChild(showPlotButton);
            showPlotButton.innerHTML = "Show Plot";

            showPlotButton.addEventListener("click", function() {
                console.log("Plot clicked");
                paintingOverlay.style.display = "flex";
                largePainting.innerHTML = "<img src='assets/images/plots/" + gallery_json[id].id + "_plot.png'>";
            });


            // Alternate the position of the image and description between exhibits for screensize > 1024
            if (i % 2 != 0 & window.innerWidth > 1024) {
                description.classList.add("description-odd");
            } else {
                description.classList.add("description-even");
            }

            // Populate dictionary with first painting of each year category
            if (gallery_json[i].year != previousYear) {
                yearDictionary.push({
                    "year": gallery_json[i].year,
                    "anchor": gallery_json[i].id
                });
                previousYear = gallery_json[i].year;
            }
        }
    }

    createExhibits();

    // Lazy load for images
    [].forEach.call(document.querySelectorAll("img[data-src]"), function(img) {

        img.setAttribute("src", img.getAttribute("data-src"));

        let exhibit = document.getElementById("exhibit-" + parseInt(img.getAttribute("data-id")));
        exhibit.style.backgroundImage = "url(" + img.getAttribute("data-src") + ")";

        let painting = document.getElementById("exhibit-painting-" + parseInt(img.getAttribute("data-id")))
        painting.className = "exhibit-painting exhibit-" + img.getAttribute("data-orientation");

        img.onload = function() {
            img.removeAttribute("data-src");
        };
    });

    // Close painting overlay button
    document.getElementById("painting-overlay-close").addEventListener("click", function() {
        let overlay = document.getElementById("painting-overlay");
        overlay.style.display = "none";
        let paintingLarge = document.getElementById("exhibit-painting-large");
        while (paintingLarge.firstChild) {
            paintingLarge.removeChild(paintingLarge.firstChild);
        }
    })

    /* Function creates sidebar navigation menu with years selection

    @params {} none
    @returns {} none */
    function generateYears() {

        // Fetch sidebar container
        let sidebar = document.getElementById("exhibit-nav-sidebar");

        // Itereate through years of activity
        for (let i = 2019; i >= 2008; i--) {

            (function() {

                // Create div for year and append to sidebar
                let year = document.createElement("div");
                year.id = "year-" + i;
                year.className = "year";
                sidebar.appendChild(year);
                year.innerHTML = i;
                let yr = i; // Need to redefine local variable

                year.addEventListener("click", function() {
                    // Iterate through year dictionary to find corresponding div to scroll to
                    for (let j = 0; j < yearDictionary.length; j++) {
                        if (yearDictionary[j].year == yr) {
                            document.getElementById("loader").style.display = "flex";
                            setTimeout(function() {
                                document.getElementById("loader").style.opacity = "0";
                                document.getElementById("loader").style.display = "none";
                            }, 1400);
                            let destinationDiv = document.getElementById("exhibit-" + parseInt(yearDictionary[j].anchor));
                            scrollToMyDiv(destinationDiv, 1000);
                        }
                    }
                });
            }());
        }

        let overlay = document.createElement("div");
        overlay.id = "year-overlay";
        sidebar.appendChild(overlay);

    }

    generateYears();

    // Initialize back-to-top button
    let backToTop = document.getElementById("back-to-top");

    backToTop.addEventListener("click", function() {
        scrollToMyDiv(document.getElementById("wrapper"), 2000);
    });


}

window.onscroll = function() {

    console.log("Scrolling");

    let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    let exhibitSidebar = document.getElementById("exhibit-nav-sidebar");
    let logoSignature = document.getElementById("logo-signature");
    let backToTop = document.getElementById("back-to-top");

    let height = window.innerHeight;
    let width = window.innerWidth;

    if (scrollTop > height / 2) {

        exhibitSidebar.style.display = "flex";
        logoSignature.style.display = "flex";
        backToTop.style.display = "flex";

        if ((scrollTop > (height / 2)) & scrollTop < ((height / 2) + 800)) {
            let opacity = (scrollTop - (height / 2)) / (100 * 8);
            exhibitSidebar.style.opacity = opacity;
            logoSignature.style.opacity = opacity;
            backToTop.style.opacity = opacity;
        } else {
            exhibitSidebar.style.opacity = "1";
            logoSignature.style.opacity = ".42";
            backToTop.style.background = "rgba(0, 0, 0, .69)";
        }

    } else {
        exhibitSidebar.style.display = "none";
        backToTop.style.display = "none";
    }

}

/* Function allows  */
function animate(elem, time) {
    console.log(document.documentElement.scrollTop, time);
    if (!elem) return;
    var to = elem.offsetTop;
    var from = document.documentElement.scrollTop; // window.scrollY would do the trick in modern browsers
    var start = new Date().getTime(),
        timer = setInterval(function() {
            var step = Math.min(1, (new Date().getTime() - start) / time);
            window.scrollTo(0, (from + step * (to - from)) + 1);
            if (step == 1) {
                clearInterval(timer);
            };
        }, 25);
    window.scrollTo(0, (from + 1));
}

function scrollToMyDiv(div, speed) {
    function updateYearSidebar() {

        let yearCurrent = document.getElementById("year-" + div.getAttribute("data-year"));

        let years = document.getElementsByClassName("year");

        for (let i = 0; i < years.length; i++) {
            years[i].className = "year";
        }
        yearCurrent.className = "year year-selected";
    }

    if (div.id != "wrapper" & div.id != "widescreen") {
        updateYearSidebar();
    }

    var divVal = document.getElementById(div.id);
    animate(divVal, speed);
}

(function() {

    document.addEventListener('wheel', findScrollDirectionOtherBrowsers);

    var delay = false;

    function findScrollDirectionOtherBrowsers(event) {
        //event.preventDefault();
        var delta;

        console.log("DELAY:", delay);
        if (delay) return;

        delay = true;
        setTimeout(function() {
            delay = false
        }, 1000)

        if (event.wheelDelta) {
            delta = event.wheelDelta;
        } else {
            delta = -1 * event.deltaY;
        }

        let exhibit = document.getElementsByClassName("exhibit");

        if (delta < 0) {
            console.log("DOWN");
            for (var i = 0; i < exhibit.length; i++) {
                var t = exhibit[i].getClientRects()[0].top;
                if (t >= 10) {
                    break;
                }
            }
        } else if (delta > 0) {
            console.log("UP");
            for (var i = exhibit.length - 1; i >= 0; i--) {
                var t = exhibit[i].getClientRects()[0].top;
                if (t < -10) {
                    break;
                }
            }
        }

        console.log(i);
        if (i >= 0 && i < exhibit.length) {

            scrollToMyDiv(exhibit[i], 500);

        } else if (i < 0) {

            scrollToMyDiv(document.getElementById("widescreen"), 700);

        }
    }
})();

(function() {

    // TODO IMPLEMENT SWIPE
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var delay = false;

    var xDown = null;
    var yDown = null;

    function handleTouchStart(evt) {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
    };

    function handleTouchMove(evt) {
        console.log("DELAY:", delay);
        if (delay) {
            return;
        }

        delay = true;
        setTimeout(function() {
            delay = false
        }, 1000)

        if (!xDown || !yDown) {
            return;
        }
        var yUp = evt.touches[0].clientY;

        var yDiff = yDown - yUp;

        let exhibit = document.getElementsByClassName("exhibit");

        if (yDiff > 0) {
            console.log("UP SWIPE");
            for (var i = 0; i < exhibit.length; i++) {
                var t = exhibit[i].getClientRects()[0].top;
                if (t >= 20) {
                    break;
                }
            }
        } else {
            console.log("DOWN SWIPE");
            for (var i = exhibit.length - 1; i >= 0; i--) {
                var t = exhibit[i].getClientRects()[0].top;
                if (t < -20) {
                    break;
                }
            }
        }

        if (i >= 0 && i < exhibit.length) {

            scrollToMyDiv(exhibit[i], 500);

        } else if (i < 0) {

            scrollToMyDiv(document.getElementById("widescreen"), 700);

        }

        xDown = null;
        yDown = null;
    };
})();
