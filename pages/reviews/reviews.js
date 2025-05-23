import { fetchUserReadlist } from "../../utlils/addToReadlist.js";
const BASE_URL = "http://localhost:1337";
import { fetchUser } from "../../utlils/getUserRating.js";

let allReviews = [];

const fetchUserReviews = async() => {
    const userInfo = await fetchUser()
    const userReviews = userInfo.reviews
    const uniqueReviews = Array.from(
        new Map(
            userReviews.map(review => [review.documentId, review])
        ).values()
      );
    return uniqueReviews
}

const renderReviews = async (reviewsToRender = null) => {
  const userReviews = reviewsToRender || (await fetchUserReviews());

  if (!reviewsToRender && allReviews.length === 0) {
    allReviews = userReviews;
  }

  const reviewsContainer = document.querySelector(".reviews-container");

  reviewsContainer.innerHTML = "";

  userReviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";

    const img = document.createElement("img");
    img.src = `${BASE_URL}${review.book.bookCover.url}`;
    img.alt = "book cover review";
    img.className = "review-img";
    reviewDiv.appendChild(img);

    const reviewBody = document.createElement("div");
    reviewBody.className = "review-body";

    const titleAuthor = document.createElement("div");
    titleAuthor.className = "title-author";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = review.book.bookName;

    const author = document.createElement("div");
    author.className = "author";
    author.textContent = `By ${review.book.authorName}`;

    titleAuthor.appendChild(title);
    titleAuthor.appendChild(author);
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

const sortAlphabetically = (reviews, order) => {
  return [...reviews].sort((a, b) => {
    const nameA = a.book.bookName.toLowerCase();
    const nameB = b.book.bookName.toLowerCase();

    if (order === "A-Z") {
      return nameA.localeCompare(nameB);
    } else if (order === "Z-A") {
      return nameB.localeCompare(nameA);
    }
    return 0;
  });
};

const sortByRating = (reviews, order) => {
  return [...reviews].sort((a, b) => {
    const ratingA = a.rating;
    const ratingB = b.rating;

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

  let filteredReviews = [...allReviews];

  const alphabetValue = alphabetSelect.value;
  if (alphabetValue && alphabetValue !== "") {
    filteredReviews = sortAlphabetically(filteredReviews, alphabetValue);
  }

  const ratingValue = ratingSelect.value;
  if (ratingValue && ratingValue !== "") {
    filteredReviews = sortByRating(filteredReviews, ratingValue);
  }

  renderReviews(filteredReviews);
};

const alphabetSelect = document.querySelector(".sort-alphabet");
const ratingSelect = document.querySelector(".sort-ratings");

alphabetSelect.addEventListener("change", applyFilters);
ratingSelect.addEventListener("change", applyFilters);

await renderReviews();
