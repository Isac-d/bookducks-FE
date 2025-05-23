import { fetchUser } from "../../utlils/getUserRating.js";
import { fetchUserReadlist } from "../../utlils/addToReadlist.js";
import { calculateRating } from "../../utlils/calculateAvgRating.js";
const BASE_URL = "http://localhost:1337";

const userInfo = await fetchUser();
const welcomeText = document.querySelector(".welcome-text");
console.log(userInfo);

welcomeText.innerHTML = `Welcome ${userInfo.username}`;

const renderRecentReadlist = async () => {
    const readlistContainer = document.querySelector(".readlist-books");
    const userReadlist = await fetchUserReadlist();
    const twoRecentReadlist = userReadlist.splice(-2).reverse();

    if(twoRecentReadlist.length === 0) {
        const emptyText = document.createElement('h1')
        emptyText.classList.add('empty-text')
        emptyText.innerHTML = 'Your readlist is empty'
        readlistContainer.appendChild(emptyText)
    }
  twoRecentReadlist.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "readlist-book";

    bookDiv.addEventListener("click", function() {
        window.location.href = `../productPage/productPage.html?id=${book.documentId}`; 
      });

    const img = document.createElement("img");

    const bookSrc = `${BASE_URL}${book.bookCover.url}`;
    img.src = bookSrc
    img.alt = "";
    img.className = "img-readlist-img";
    bookDiv.appendChild(img);

    const bodyDiv = document.createElement("div");
    bodyDiv.className = "readlist-body";

    const titleAuthorDiv = document.createElement("div");
    titleAuthorDiv.className = "readlist-title-author";

    const title = document.createElement("h3");
    title.className = "readlist-title";
    title.textContent = book.bookName;

    const author = document.createElement("h3");
    author.className = "readlist-author";
    author.textContent = book.authorName;

    titleAuthorDiv.appendChild(title);
    titleAuthorDiv.appendChild(author);

    const starContainer = document.createElement("div");
    starContainer.className = "readlist-stars";

    // Empty stars container
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
    starContainer.appendChild(starEmpty);
    starContainer.appendChild(starFilled);

    bodyDiv.appendChild(titleAuthorDiv);
    bodyDiv.appendChild(starContainer);

    const avgRating = calculateRating(book.reviews)

    const ratingPercentage = (avgRating / 5) * 100;
    starFilled.style.width = `${ratingPercentage}%`;

    bookDiv.appendChild(bodyDiv);

    readlistContainer.appendChild(bookDiv); 
  });
};

const renderRecentReviews = async () => {
    const ratedContainer = document.querySelector(".rated-books");
    const userData = await fetchUser()
    const userReviews = userData.reviews
    const uniqueReviews = Array.from(
        new Map(
            userReviews.map(review => [review.documentId, review])
        ).values()
      );
    const twoRecentReviews = uniqueReviews.splice(-2).reverse();
    if(twoRecentReviews.length === 0) {
        const emptyText = document.createElement('h1')
        emptyText.classList.add('empty-text')
        emptyText.innerHTML = 'You have no reviews'
        ratedContainer.appendChild(emptyText)

    }

    twoRecentReviews.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "readlist-book";

    bookDiv.addEventListener("click", function() {
        window.location.href = `../productPage/productPage.html?id=${book.book.documentId}`; 
      });

    const img = document.createElement("img");

    const bookSrc = `${BASE_URL}${book.book.bookCover.url}`;
    img.src = bookSrc
    img.alt = "";
    img.className = "img-readlist-img";
    bookDiv.appendChild(img);

    const bodyDiv = document.createElement("div");
    bodyDiv.className = "readlist-body";

    const titleAuthorDiv = document.createElement("div");
    titleAuthorDiv.className = "readlist-title-author";

    const title = document.createElement("h3");
    title.className = "readlist-title";
    title.textContent = book.book.bookName;

    const author = document.createElement("h3");
    author.className = "readlist-author";
    author.textContent = book.book.authorName;

    titleAuthorDiv.appendChild(title);
    titleAuthorDiv.appendChild(author);

    const starContainer = document.createElement("div");
    starContainer.className = "readlist-stars";

    // Empty stars container
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
    starContainer.appendChild(starEmpty);
    starContainer.appendChild(starFilled);

    bodyDiv.appendChild(titleAuthorDiv);
    bodyDiv.appendChild(starContainer);

    // const avgRating = calculateRating(book.reviews)

    const ratingPercentage = (book.rating / 5) * 100;
    starFilled.style.width = `${ratingPercentage}%`;

    bookDiv.appendChild(bodyDiv);

    ratedContainer.appendChild(bookDiv); 
  });


}

const logOutButton = document.querySelector('.log-Out')

logOutButton.addEventListener('click', ()=>{
  localStorage.removeItem('token');
  localStorage.removeItem('userId')
}
)


renderRecentReviews()
renderRecentReadlist();
