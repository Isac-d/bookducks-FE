import { calculateRating } from "./calculateAvgRating.js";
import { isUserSignedIn } from "./isUserSignedIn.js";
const BASE_URL = "http://localhost:1337";

export const fetchUser = async () => {
  const token = localStorage.getItem("token");
  if (!isUserSignedIn()) {
    return;
  }
  const decoded = jwt_decode(token);
  const userId = decoded.id;
  console.log('userid'+userId)
  try {
    const response = await fetch(
      `${BASE_URL}/api/users/${userId}?populate[reviews][populate][book][populate]=bookCover`
,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await response.json();
    const data = json;

    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getUserRating = async (bookId) => {
  if (!isUserSignedIn()) {
    return;
  }
  const userInfo = await fetchUser();
  const userReviews = userInfo.reviews;
  console.log(userReviews);
  if (!userReviews) {
    return 0;
  }
  const specificBookReviews = userReviews.filter(
    (review) => review.book.documentId === bookId
  );
  const userBookRating = calculateRating(specificBookReviews);
  return userBookRating;
};
