import { calculateRating } from "../../utlils/calculateAvgRating.js";
import { fetchData } from "../../utlils/fetchData.js";
import { openPopup, closePopup } from "../../utlils/openPopup.js";

const BASE_URL = "http://localhost:1337";
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

const renderBook = async()=> {
    const bookInfo = await fetchData(`${BASE_URL}/api/books/${bookId}?populate=*`)
    const bookTitle = document.querySelector('.book-title-author h1')
    bookTitle.innerHTML = bookInfo.bookName

    const bookAuthor = document.querySelector('.book-title-author h2')
    bookAuthor.innerHTML = `Written By ${bookInfo.authorName}`

    const bookAbout = document.querySelector('.about .pages')
    bookAbout.innerHTML = `${bookInfo.pageNumber} Pages`

    const bookDate = document.querySelector('.about .release-date')
    bookDate.innerHTML = `${bookInfo.releaseDate}`

    const bookDesc = document.querySelector('.description-text')
    bookDesc.innerHTML = `${bookInfo.description}`

    const bookImg = document.querySelector('.single-book-img')
    const bookSrc = `${BASE_URL}${bookInfo.bookCover.url}`
    bookImg.src = bookSrc;
    bookImg.alt = "book cover";


    const starsDiv = document.querySelector('.product-star-container')

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

    const avgRating = calculateRating(bookInfo.reviews);
    const ratingPercentage = (avgRating / 5) * 100;
    starFilled.style.width = `${ratingPercentage}%`;

    const reviewCount = document.querySelector('.vote-count')

    const numberOfReviews = bookInfo.reviews.length
    reviewCount.innerHTML = numberOfReviews === 1 ? `- ${numberOfReviews} VOTE` : `- ${numberOfReviews} VOTES`

    const ratingNumber = document.querySelector('.logo-yellow.rating')
    ratingNumber.innerHTML = avgRating
    const reviewButton = document.querySelector('.review-btn')
    reviewButton.addEventListener('click', ()=> openPopup(bookInfo.bookName, bookSrc, bookInfo.documentId))

}

const renderReviews = async () => {
    const bookInfo = await fetchData(
        `${BASE_URL}/api/books/${bookId}?populate[reviews][populate][0]=user&populate[reviews][populate][1]=book
`
      );
    console.log(bookInfo)
    const reviewArr = bookInfo.reviews
    const reviewsContainer = document.querySelector(".review-list");
  
    reviewArr.forEach((review) => {
      const reviewDiv = document.createElement("div");
      reviewDiv.className = "review";
  
      const reviewBody = document.createElement("div");
      reviewBody.className = "review-body";
  
      const titleAuthor = document.createElement("div");
      titleAuthor.className = "title-author";
  
      const title = document.createElement("div");
      title.className = "title";
      title.textContent = review.user.username;
  
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

  const closeButton = document.querySelector('.fa-xmark')
  const overlay = document.querySelector('.site-overlay')

if(closeButton){
  closeButton.addEventListener('click', closePopup)
  overlay.addEventListener('click', closePopup)
}


const starRating = document.getElementById('starRating');
const starFilled = document.getElementById('starFilled');
const ratingValue = document.getElementById('ratingValue');
const starCount = 5;

// Handle mouse movement over the stars
if(starRating){

starRating.addEventListener('mousemove', function(e) {
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
  ratingValue.textContent = `Rating: ${rating} / 5`;
});

// Handle when mouse leaves the star rating
starRating.addEventListener('mouseleave', function() {
  // Reset to 0 stars
  starFilled.style.width = "0%";
  ratingValue.textContent = "Rating: 0 / 5";
});

starRating.addEventListener('click', function() {
  const currentWidth = starFilled.style.width;
  const currentPercentage = parseFloat(currentWidth);
  const rating = (currentPercentage / 100) * 5;
  alert(`You rated: ${rating} stars!`);

});
}



renderReviews()
renderBook()