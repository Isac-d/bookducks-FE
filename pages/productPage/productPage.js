import { calculateRating } from "../../utlils/calculateAvgRating.js";
import { fetchData } from "../../utlils/fetchData.js";

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
    bookImg.src = `${BASE_URL}${bookInfo.bookCover.url}`;
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
  

renderReviews()
renderBook()