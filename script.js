import { calculateRating } from "../frontend/utlils/calculateAvgRating.js";
import { isUserSignedIn } from "./utlils/isUserSignedIn.js";
const BASE_URL = "http://localhost:1337";
const fetchBooks = async (url) => {
  try {
    const response = await fetch(`${url}/api/books?populate=*`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    const data = json.data;
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

const fetchReviews = async (url) => {
  try {
    const response = await fetch(
      `${url}/api/reviews?populate[book][populate]=bookCover&populate=user`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    const data = json.data;
    const mostRecentReviews = data.slice(-6);

    return mostRecentReviews.reverse();
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
fetchReviews(BASE_URL);

const getTopThreeBooks = (books) => {
  // Sort the books in descending order based on the number of reviews
  const sortedBooks = books.sort((a, b) => b.reviews.length - a.reviews.length);
  // Return the top 3 books
  return sortedBooks.slice(0, 3);
};
const renderPopularBooks = async () => {
  const allBooks = await fetchBooks(BASE_URL);
  let popularBooks = getTopThreeBooks(allBooks);
  const bookContainer = document.querySelector(".popular-books");

  popularBooks.forEach((book) => {
    const popularBookDiv = document.createElement("div");
    popularBookDiv.className = "popular-book";

    // Create image container with overlay
    const imgContainer = document.createElement("div");
    imgContainer.className = "img-container-popular";

    // Create image overlay with buttons
    const imgOverlay = document.createElement("div");
    imgOverlay.className = "img-overlay";
    imgOverlay.addEventListener("click", function() {
      window.location.href = `pages/productPage/productPage.html?id=${book.documentId}`; 
    });

    // Create button container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    buttonContainer.style.display = isUserSignedIn() ? 'flex' : 'none'

    // Create "ADD TO READLIST" button
   

    // Create book icon for the add to readlist button
    const bookIcon = document.createElement("i");
    bookIcon.className = "fa-solid fa-book";
    bookIcon.style.color = "white";

    // Create "REVIEW BOOK" button
    const reviewButton = document.createElement("button");
    reviewButton.className = "review-button-popular";
    reviewButton.textContent = "REVIEW BOOK";
    // Append buttons to button container
    buttonContainer.appendChild(reviewButton);

    // Append button container to overlay
    imgOverlay.appendChild(buttonContainer);

    // Create img element
    const img = document.createElement("img");
    img.src = `${BASE_URL}${book.bookCover.url}`;
    img.alt = "book cover";

    // Append overlay and img to imgContainer
    imgContainer.appendChild(imgOverlay);
    imgContainer.appendChild(img);

    // Create book info container
    const bookInfoDiv = document.createElement("div");
    bookInfoDiv.className = "book-name-stars-container-popular";

    // Create title
    const title = document.createElement("h3");
    title.textContent = book.bookName;

    // Create stars container
    const starsDiv = document.createElement("div");
    starsDiv.className = "stars-popular";

    const starEmpty = document.createElement("div");
    starEmpty.className = "star-empty";

    // Filled stars container
    const starFilled = document.createElement("div");
    starFilled.className = "star-filled";

    for (let i = 0; i < 5; i++) {
      const emptyStar = document.createElement("i");
      emptyStar.className = "fas fa-star";
      starEmpty.appendChild(emptyStar);

      const filledStar = document.createElement("i");
      filledStar.className = "fas fa-star";
      starFilled.appendChild(filledStar);
    }

    starsDiv.appendChild(starEmpty);
    starsDiv.appendChild(starFilled);

    const avgRating = calculateRating(book.reviews);
    const ratingPercentage = (avgRating / 5) * 100;
    starFilled.style.width = `${ratingPercentage}%`;

    // Append title and stars to book info div
    bookInfoDiv.appendChild(title);
    bookInfoDiv.appendChild(starsDiv);

    // Append imgContainer and bookInfoDiv to popularBookDiv
    popularBookDiv.appendChild(imgContainer);
    popularBookDiv.appendChild(bookInfoDiv);

    // Append popularBookDiv to bookContainer
    bookContainer.appendChild(popularBookDiv);
  });
};

const renderAllBooks = async () => {
  const allBooks = await fetchBooks(BASE_URL);
  const bookContainer = document.querySelector(".discover-books-container");
  
  allBooks.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "book";

    // Create image container with overlay
    const imgContainer = document.createElement("div");
    imgContainer.className = "img-container";

    // Create image overlay with buttons
    const imgOverlay = document.createElement("div");
    imgOverlay.className = "img-overlay";
    imgOverlay.addEventListener("click", function() {
      window.location.href = `pages/productPage/productPage.html?id=${book.documentId}`; 
    });

    // Create button container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    buttonContainer.style.display = isUserSignedIn() ? 'flex' : 'none'


  

    // Create book icon for the add to readlist button
    const bookIcon = document.createElement("i");
    bookIcon.className = "fa-solid fa-book";
    bookIcon.style.color = "white";

    // Create "REVIEW BOOK" button
    const reviewButton = document.createElement("button");
    reviewButton.className = "review-button";
    reviewButton.textContent = "REVIEW BOOK";

    // Append buttons to button container
    buttonContainer.appendChild(reviewButton);

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

const renderRecentReviews = async () => {
  const recentReviews = await fetchReviews(BASE_URL);
  const reviewsContainer = document.querySelector(".reviews-container");

  recentReviews.forEach((review) => {
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

    const reviewUser = document.createElement("div");
    reviewUser.className = "review-user";
    reviewUser.textContent = review.user.username;

    reviewDiv.appendChild(reviewUser);

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
const logOutButton = document.querySelector('.log-Out')


logOutButton.addEventListener('click', ()=>{
  localStorage.removeItem('token');
  localStorage.removeItem('userId')
}
)

renderRecentReviews();
renderAllBooks();
renderPopularBooks();
