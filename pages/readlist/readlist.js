import { fetchUserReadlist } from "../../utlils/addToReadlist.js";
const BASE_URL = "http://localhost:1337";
import { calculateRating } from "../../utlils/calculateAvgRating.js";

let allBooks = [];

const renderBooks = async (booksToRender = null) => {
  const userReadlist = booksToRender || (await fetchUserReadlist());

  if (!booksToRender && allBooks.length === 0) {
    allBooks = userReadlist;
  }

  const bookContainer = document.querySelector(".book-container");

  bookContainer.innerHTML = "";

  userReadlist.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "book";

    // Create image container with overlay
    const imgContainer = document.createElement("div");
    imgContainer.className = "img-container";

    // Create image overlay with buttons
    const imgOverlay = document.createElement("div");
    imgOverlay.className = "img-overlay";
    imgOverlay.addEventListener("click", function () {
      window.location.href = `pages/productPage/productPage.html?id=${book.documentId}`;
    });

    // Create button container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    // Create book icon for the add to readlist button
    const bookIcon = document.createElement("i");
    bookIcon.className = "fa-solid fa-book";
    bookIcon.style.color = "white";

    // Append button container to overlay
    imgOverlay.appendChild(buttonContainer);

    // Create img element
    const img = document.createElement("img");
    img.src = `${BASE_URL}${book.bookCover.url}`;
    img.alt = "Book cover";

    // Append overlay and img to imgContainer
    imgContainer.appendChild(imgOverlay);
    imgContainer.appendChild(img);

    // Append imgContainer to bookDiv
    bookDiv.appendChild(imgContainer);

    // Create info container
    const infoDiv = document.createElement("div");
    infoDiv.className = "book-name-stars-container";

    // Create title
    const title = document.createElement("h3");
    title.textContent = book.bookName;
    infoDiv.appendChild(title);

    // Calculate average rating
    const avgRating = calculateRating(book.reviews);

    // Create stars container
    const starsDiv = document.createElement("div");
    starsDiv.className = "stars-book";

    const starEmpty = document.createElement("div");
    starEmpty.className = "star-empty";

    // Filled stars container
    const starFilled = document.createElement("div");
    starFilled.className = "star-filled";

    for (let i = 0; i < 5; i++) {
      const emptyStar = document.createElement("i");
      emptyStar.className = "fas fa-star fa-sm";
      starEmpty.appendChild(emptyStar);

      const filledStar = document.createElement("i");
      filledStar.className = "fas fa-star fa-sm";
      starFilled.appendChild(filledStar);
    }

    starsDiv.appendChild(starEmpty);
    starsDiv.appendChild(starFilled);

    const ratingPercentage = (avgRating / 5) * 100;
    starFilled.style.width = `${ratingPercentage}%`;

    infoDiv.appendChild(starsDiv);
    bookDiv.appendChild(infoDiv);
    bookContainer.appendChild(bookDiv);
  });
};

const sortAlphabetically = (books, order) => {
  return [...books].sort((a, b) => {
    const nameA = a.bookName.toLowerCase();
    const nameB = b.bookName.toLowerCase();

    if (order === "A-Z") {
      return nameA.localeCompare(nameB);
    } else if (order === "Z-A") {
      return nameB.localeCompare(nameA);
    }
    return 0;
  });
};

const sortByRating = (books, order) => {
  return [...books].sort((a, b) => {
    const ratingA = calculateRating(a.reviews);
    const ratingB = calculateRating(b.reviews);

    if (order === "rising") {
      return ratingA - ratingB;
    } else if (order === "Decending") {
      return ratingB - ratingA;
    }
    return 0;
  });
};

const applyFilters = () => {
  const alphabetSelect = document.querySelector(".sort-alphabet");
  const ratingSelect = document.querySelector(".sort-ratings");

  let filteredBooks = [...allBooks];

  const alphabetValue = alphabetSelect.value;
  if (alphabetValue && alphabetValue !== "") {
    filteredBooks = sortAlphabetically(filteredBooks, alphabetValue);
  }

  const ratingValue = ratingSelect.value;
  if (ratingValue && ratingValue !== "") {
    filteredBooks = sortByRating(filteredBooks, ratingValue);
  }

  renderBooks(filteredBooks);
};

const alphabetSelect = document.querySelector(".sort-alphabet");
const ratingSelect = document.querySelector(".sort-ratings");

alphabetSelect.addEventListener("change", applyFilters);
ratingSelect.addEventListener("change", applyFilters);

await renderBooks();
