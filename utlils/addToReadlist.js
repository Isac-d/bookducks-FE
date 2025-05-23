import { fetchUser } from "./getUserRating.js";

const BASE_URL = "http://localhost:1337";

export const fetchUserReadlist = async () => {
  const token = localStorage.getItem("token");
  if(!token) {
    return
  }
  const decoded = jwt_decode(token);
  const userId = decoded.id;
  try {
    const response = await fetch(
`${BASE_URL}/api/users/${userId}?populate[savedbooks][populate][bookCover]=*&populate[savedbooks][populate][reviews]=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );


    const json = await response.json();
    const readlist = json.savedbooks;
    
    const uniqueSavedBooks = Array.from(
      new Map(
        readlist.map(book => [book.documentId, book])
      ).values()
    );

    return uniqueSavedBooks;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const addToReadlist = async (bookId) => {
  const addBtn = document.querySelector('.addtoreadlist p')
  addBtn.innerHTML = 'Remove from readlist'
  const token = localStorage.getItem("token");
  if(!token) {
    return
  }
  const userInfo = await fetchUser();
  const userId = userInfo.id;
  
  const readlist = await fetchUserReadlist();
  const readlistIds = readlist.map((book) => book?.id);

  
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        savedbooks: [...readlistIds, bookId]
        
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error details:', errorData);
      throw new Error(`Failed to update user. Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Book added:', data);
   console.log(readlist)

    return data;
  } catch (error) {
    console.error('Error updating user savedbooks:', error);
    throw error;
  }
};

export const RemoveFromReadlist = async (bookId) => {
  const addBtn = document.querySelector('.addtoreadlist p')
  addBtn.innerHTML = 'Add to readlist'
  const token = localStorage.getItem("token");
  if(!token) {
    return
  }
  const userInfo = await fetchUser();
  const userId = userInfo.id;
  
  const readlist = await fetchUserReadlist();
  const readlistIds = readlist.map((book) => book?.id);
  const newReadlist = readlistIds.filter(book => book !== bookId)


 
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        savedbooks: newReadlist
        
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error details:', errorData);
      throw new Error(`Failed to update user. Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Book deleted', data);
    console.log(readlist)

    return data;
  } catch (error) {
    console.error('Error updating user savedbooks:', error);
    throw error;
  }
};