


export const postReview = async (reviewData) => {
  const BASE_URL = "http://localhost:1337";
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! ${response.status} - ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    const result = await response.json();
    console.log("Review created successfully:", result);
  } catch (error) {
    console.error("Failed to create review:", error.message);
  }
};
