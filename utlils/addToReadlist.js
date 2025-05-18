export const addToReadlist = async(bookId, userId)=> {
    const BASE_URL = "http://localhost:1337";
    const token = localStorage.getItem("token");

    const readlistData = {
        data: {
            books: bookId,
            user: userId
        }
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/readlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
  
        body: JSON.stringify(readlistData),
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
      console.log("Book added successfully:", result);
    } catch (error) {
      console.error("Failed to add book to readlist:", error.message);
    }
}