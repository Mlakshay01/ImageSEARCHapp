const accesskey = "SmLQ8tEEszWMqSzz9lzuwIVYhPqotSNpLJJ11LJgAW4";
const formEl = document.querySelector("#search-form");
const inputEl = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const showMoreButton = document.getElementById("show-more-button");

let inputData = "";
let page = 1;

// Function to fetch and display random images
async function loadRandomImages() {
    const randomUrl = `https://api.unsplash.com/photos/random?count=10&client_id=${accesskey}`;

    const response = await fetch(randomUrl);
    const data = await response.json();

    data.forEach((result) => {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("search-result");

        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = "";

        const downloadButton = createDownloadButton(result.urls.raw);

        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("image-container");
        imageWrapper.appendChild(image);
        imageWrapper.appendChild(downloadButton);

        imageContainer.appendChild(imageWrapper);
        searchResults.appendChild(imageContainer);
    });
}

// Function to create a download button for an image URL
function createDownloadButton(imageUrl) {
    const downloadButton = document.createElement("button");
    downloadButton.classList.add("download-button");

    const downloadIcon = document.createElement("img");
    downloadIcon.src = "download.png"; // Replace with your custom image path
    downloadIcon.alt = "Download";

    downloadButton.appendChild(downloadIcon);

    downloadButton.addEventListener("click", async () => {
        const link = document.createElement("a");
        link.href = imageUrl + "?dl";
        link.download = "image.jpg";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    return downloadButton;
}

// Function to load more search-related images when "Show more" button is clicked
async function loadMoreSearchImages() {
    if (inputData.trim() === "") {
        await loadRandomImages(); // Load random images when search input is blank
    } else {
        await searchImages(); // Load search-related images when search input is not blank
    }
}

// Function to search for images
async function searchImages() {
    inputData = inputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accesskey}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;
    if (results) {
        if (page === 1) {
            searchResults.innerHTML = "";
        }

        results.forEach((result) => {
            const imageContainer = document.createElement("div");
            imageContainer.classList.add("search-result");

            const image = document.createElement("img");
            image.src = result.urls.small;
            image.alt = "";

            const downloadButton = createDownloadButton(result.urls.raw);

            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("image-container");
            imageWrapper.appendChild(image);
            imageWrapper.appendChild(downloadButton);

            imageContainer.appendChild(imageWrapper);
            searchResults.appendChild(imageContainer);
        });

        page++;
        if (page > 1) {
            showMoreButton.style.display = "block";
        }
    } else {
        console.error("No results found");
    }
}

// Call the function to load random images on page load
loadRandomImages();

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

showMoreButton.addEventListener("click", loadMoreSearchImages);
