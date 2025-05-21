import { calculateRating } from "../../utlils/calculateAvgRating.js";
import { fetchData } from "../../utlils/fetchData.js";
import { openPopup, closePopup } from "../../utlils/openPopup.js";
import { postReview } from "../../utlils/postReview.js";
import { getUserRating, fetchUser } from "../../utlils/getUserRating.js";
import { editReview } from "../../utlils/editReview.js";
import { isUserSignedIn } from "../../utlils/isUserSignedIn.js";
import {
  addToReadlist,
  RemoveFromReadlist,
} from "../../utlils/addToReadlist.js";
import { fetchUserReadlist } from "../../utlils/addToReadlist.js";

const BASE_URL = "http://localhost:1337";
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");

const reviewReadlist = document.querySelector(".review-readlist");
const logInToReview = document.querySelector(".log-in-to-review");
if (logInToReview) {
  logInToReview.style.display = isUserSignedIn() ? "none" : "flex";
  reviewReadlist.style.display = isUserSignedIn() ? "flex" : "none";
}

const renderBook = async () => {
  const addReadlistBtn = document.querySelector(".addtoreadlist p");
  const userReadlist = await fetchUserReadlist();
  let userReadlistIds = userReadlist.map((book) => book.documentId);

  const bookInfo = await fetchData(
    `${BASE_URL}/api/books/${bookId}?populate=*`
  );
  const bookTitle = document.querySelector(".book-title-author h1");
  bookTitle.innerHTML = bookInfo.bookName;

  const bookAuthor = document.querySelector(".book-title-author h2");
  bookAuthor.innerHTML = `Written By ${bookInfo.authorName}`;

  const bookAbout = document.querySelector(".about .pages");
  bookAbout.innerHTML = `${bookInfo.pageNumber} Pages`;

  const bookDate = document.querySelector(".about .release-date");
  bookDate.innerHTML = `${bookInfo.releaseDate}`;

  const bookDesc = document.querySelector(".description-text");
  bookDesc.innerHTML = `${bookInfo.description}`;

  const bookImg = document.querySelector(".single-book-img");
  const bookSrc = `${BASE_URL}${bookInfo.bookCover.url}`;
  bookImg.src = bookSrc;
  bookImg.alt = "book cover";

  addReadlistBtn.innerHTML = userReadlistIds.includes(bookInfo.documentId)
    ? "Remove from readlist"
    : "Add to readlist";

  const starsDiv = document.querySelector(".product-star-container");
  starsDiv.addEventListener("click", () =>
    openPopup(bookInfo.bookName, bookSrc, bookInfo.documentId)
  );
  const starEmpty = document.createElement("div");
  starEmpty.className = "star-empty";

  // Filled stars container
  const starFilled = document.createElement("div");
  starFilled.className = "star-filled";

  for (let i = 0; i < 5; i++) {
    const emptyStar = document.createElement("i");
    emptyStar.className = "fas fa-star fa-xl";
    starEmpty.appendChild(emptyStar);

    const filledStar = document.createElement("i");
    filledStar.className = "fas fa-star fa-xl";
    starFilled.appendChild(filledStar);
  }

  starsDiv.appendChild(starEmpty);
  starsDiv.appendChild(starFilled);

  const userBookRating = await getUserRating(bookInfo.documentId);
  const avgRating = calculateRating(bookInfo.reviews);

  console.log(avgRating);
  const ratingPercentage = (userBookRating / 5) * 100;
  starFilled.style.width = `${ratingPercentage}%`;

  const reviewCount = document.querySelector(".vote-count");

  const numberOfReviews = bookInfo.reviews.length;
  reviewCount.innerHTML =
    numberOfReviews === 1
      ? `- ${numberOfReviews} VOTE`
      : `- ${numberOfReviews} VOTES`;

  const ratingNumber = document.querySelector(".logo-yellow.rating");
  ratingNumber.innerHTML = avgRating;
  const reviewButton = document.querySelector(".review-btn");

  reviewButton.addEventListener("click", () =>
    openPopup(bookInfo.bookName, bookSrc, bookInfo.documentId)
  );
  const readlistBtn = document.querySelector(".addtoreadlist");
  if (readlistBtn) {
    readlistBtn.addEventListener("click", async () => {
      if (!userReadlistIds.includes(bookInfo.documentId)) {
        handleAddToReadlist(bookInfo.id);
      } else {
        await RemoveFromReadlist(bookInfo.id);
      }
      const newUserReadlist = await fetchUserReadlist();
      userReadlistIds = newUserReadlist.map((book) => book.documentId);
    });
  }
};

const renderReviews = async () => {
  const bookInfo = await fetchData(
    `${BASE_URL}/api/books/${bookId}?populate[reviews][populate][0]=user&populate[reviews][populate][1]=book
`
  );

  console.log(bookInfo);
  const reviewArr = bookInfo.reviews;
  const reviewPlaceholder = document.querySelector(".review-placeholer");
  const reviewsContainer = document.querySelector(".review-list");
  if (reviewArr.length > 0) {
    reviewPlaceholder.style.display = "none";
  }

  reviewArr.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";

    const reviewBody = document.createElement("div");
    reviewBody.className = "review-body";

    const titleAuthor = document.createElement("div");
    const userIcon = document.createElement("i");
    userIcon.className = "fa-solid fa-circle-user";
    titleAuthor.className = "title-user";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = review.user.username;

    titleAuthor.appendChild(userIcon);
    titleAuthor.appendChild(title);

    reviewBody.appendChild(titleAuthor);

    const reviewText = document.createElement("div");
    reviewText.className = "review-text";
    reviewText.textContent = review.reviewText;
    reviewBody.appendChild(reviewText);
    reviewDiv.appendChild(reviewBody);

    reviewsContainer.appendChild(reviewDiv);

    const reviewRating = document.createElement("div");
    reviewRating.className = "review-rating";
    // Create star container with proper structure
    const starContainer = document.createElement("div");
    starContainer.className = "star-container";

    // Empty stars container
    const starEmpty = document.createElement("div");
    starEmpty.className = "star-empty";

    // Filled stars container
    const starFilled = document.createElement("div");
    starFilled.className = "star-filled";

    // Add 5 stars to both containers
    for (let i = 0; i < 5; i++) {
      const emptyStar = document.createElement("i");
      emptyStar.className = "fas fa-star";
      starEmpty.appendChild(emptyStar);

      const filledStar = document.createElement("i");
      filledStar.className = "fas fa-star";
      starFilled.appendChild(filledStar);
    }

    starContainer.appendChild(starEmpty);
    starContainer.appendChild(starFilled);
    reviewRating.appendChild(starContainer);
    reviewBody.appendChild(reviewRating);

    // Set the star rating (assuming review.rating is on a scale of 1-10)
    // First convert the 1-10 scale to 0.5-5 stars
    const starRating = review.rating / 2;
    // Then calculate percentage of the total width
    const ratingPercentage = (starRating / 5) * 100;
    starFilled.style.width = `${ratingPercentage}%`;
  });
};

const closeButton = document.querySelector(".fa-xmark");
const overlay = document.querySelector(".site-overlay");

if (closeButton) {
  closeButton.addEventListener("click", closePopup);
  overlay.addEventListener("click", closePopup);
}

const starRating = document.getElementById("starRating");
const starFilled = document.getElementById("starFilled");
const starCount = 5;

// Variable to track if a rating has been selected
let ratingSelected = false;
let selectedRating = 0;

// Handle mouse movement over the stars
if (starRating) {
  starRating.addEventListener("mousemove", function (e) {
    // Only update on hover if no rating is selected or user is hovering again after selection
    if (!ratingSelected) {
      // Calculate relative position within the star rating container
      const rect = starRating.getBoundingClientRect();
      const position = e.clientX - rect.left;

      // Calculate percentage of width (0-100%)
      const percentage = (position / rect.width) * 100;

      // Calculate rating on a 0-10 scale (for half-star increments)
      let ratingScale = (percentage / 100) * (starCount * 2);

      // Round to nearest 1 (which represents half a star)
      ratingScale = Math.round(ratingScale);

      // Convert back to a 0-5 scale with 0.5 increments
      const rating = ratingScale / 2;

      // Calculate percentage for exact half or full stars
      const exactPercentage = (ratingScale / (starCount * 2)) * 100;

      // Update filled stars width to snap to half or full stars
      starFilled.style.width = exactPercentage + "%";

      // Update rating text
    }
  });

  // Handle when mouse leaves the star rating
  starRating.addEventListener("mouseleave", function () {
    if (!ratingSelected) {
      // Reset to 0 stars if no rating is selected
      starFilled.style.width = "0%";
    } else {
      starFilled.style.width = `${(selectedRating / 5) * 100}%`;
    }
  });

  // Handle when user clicks to set a rating
  starRating.addEventListener("click", function (e) {
    // Calculate relative position and rating just like in mousemove
    const rect = starRating.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const percentage = (position / rect.width) * 100;
    let ratingScale = (percentage / 100) * (starCount * 2);
    ratingScale = Math.round(ratingScale);
    const rating = ratingScale / 2;
    const exactPercentage = (ratingScale / (starCount * 2)) * 100;

    // Set the selected rating
    selectedRating = rating;
    ratingSelected = true;

    // Update UI
    starFilled.style.width = exactPercentage + "%";
  });

  // Add a mouseenter event to allow re-rating
  starRating.addEventListener("mouseenter", function () {
    // Allow the user to rate again by setting ratingSelected to false when hovering
    ratingSelected = false;
  });
}

export const handleAddReview = async () => {
  const reviewText = document.querySelector(".review-textarea").value;
  const bookInfo = await fetchData(
    `${BASE_URL}/api/books/${bookId}?populate[reviews][populate][0]=user&populate[reviews][populate][1]=book
`
  );
  const userInfo = await fetchUser();
  const userId = userInfo.documentId;
  console.log(userId);
  const rating = selectedRating * 2;

  if (selectedRating === 0) {
    alert("Please rate book atleast 0.5 Stars");
    return;
  }

  const reviewData = {
    data: {
      user: userId,
      reviewText,
      rating,
      book: bookInfo.documentId,
    },
  };
  await postReview(reviewData);
  window.location.reload();
};
const handleAddToReadlist = async (bookId) => {
  await addToReadlist(bookId);
};

export const handleEditReview = async (reviewId, bookId, rating) => {
  const userInfo = await fetchUser();
  const userId = userInfo.documentId;
  console.log(selectedRating);

  const reviewText = document.querySelector(".review-textarea").value;

  let newRating = rating;

  if (selectedRating > 0) {
    newRating = selectedRating * 2; // Assuming you're storing as 0.5 increments
  }

  if (selectedRating === 0 && newRating === 0) {
    alert("Please rate book atleast 0.5 Stars");
    return;
  }
  const reviewData = {
    data: {
      user: userId,
      reviewText,
      rating: newRating,
      book: bookId,
    },
  };
  await editReview(reviewId, reviewData);
  window.location.reload();
};

renderReviews();
renderBook();
