export const fetchData = async (url) => {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const json = await response.json();
      const data = json.data;
      console.log(data)
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };