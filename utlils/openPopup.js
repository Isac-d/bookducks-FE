import { fetchUser } from "./getUserRating.js";
import { editReview } from "./editReview.js";
import {
  handleAddReview,
  handleEditReview,
} from "../pages/productPage/productPage.js";

export const findUserReview = async (bookId) => {
  const userInfo = await fetchUser();
  const userReviews = userInfo.reviews;
  if(!userReviews){
    return
  }

  const specificBookReview = userReviews.filter(
    (review) => review.book.documentId === bookId
  );

  if (specificBookReview.length === 0) {
    return false;
  }
  if (specificBookReview.length > 0) {
    return specificBookReview[0];
  }
};

export const openPopup = async (title, image, bookId) => {
  const bookTitle = document.querySelector(".review-book-title");
  const bookImage = document.querySelector(".review-book-img");
  const overlay = document.querySelector(".site-overlay");
  const popup = document.querySelector(".review-popup");
  const starFilled = document.getElementById("starFilled");
  const textarea = document.querySelector(".review-textarea");
  const addReviewButton = document.querySelector(".submit-review");

  const hasReview = await findUserReview(bookId);

  if (hasReview) {
    const exactPercentage = (hasReview.rating / (5 * 2)) * 100;
    starFilled.style.width = exactPercentage + "%";
    textarea.value = hasReview.reviewText;
    addReviewButton.innerHTML = "EDIT REVIEW";
    document
      .querySelector(".submit-review")
      .addEventListener("click",()=> handleEditReview(hasReview.documentId, hasReview.book.documentId, hasReview.rating));
  } else {
    addReviewButton.innerHTML = "ADD REVIEW";
    document
      .querySelector(".submit-review")
      .addEventListener("click", handleAddReview);
  }

  overlay.style.display = "block";
  popup.style.display = "flex";

  bookTitle.innerHTML = title;
  bookImage.src = image;
};

export const closePopup = () => {
  const overlay = document.querySelector(".site-overlay");
  const popup = document.querySelector(".review-popup");
  overlay.style.display = "none";
  popup.style.display = "none";
};
