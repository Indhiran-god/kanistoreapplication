// Function to handle search input change
const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (value.trim() === "") {
      setSearchResults([]); // Clear results if input is empty
      return;
    }
  
    // Check if SummaryApi.search_products is defined
    if (!SummaryApi.search_products || !SummaryApi.search_products.url) {
      console.error("Search API URL is not defined.");
      toast.error("Search functionality is currently unavailable.");
      return;
    }
  
    // Fetch products based on search term
    try {
      const response = await fetch(`${SummaryApi.search_products.url}?query=${encodeURIComponent(value)}`);
      const data = await response.json();
      setSearchResults(data.products || []); // Assuming the API returns an object with a 'products' array
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Error fetching search results");
    }
  };
  