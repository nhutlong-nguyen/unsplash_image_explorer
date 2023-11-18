import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import './index.css';

// Constants for API endpoint and pagination
const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 20;

const App = () => {
  // Ref for the search input field to maintain its state across renders
  const searchInput = useRef(null);
  
  // State hooks for images, pagination, loading status, and error messages
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Function to fetch images from the Unsplash API
  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg('');
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg('Error fetching images. Try again later.');
      console.log(error);
      setLoading(false);
    }
  }, [page]);

  // Effect hook to fetch images on component mount and when page changes
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Function to reset search to the first page and fetch new images
  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  // Handler for search submission
  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  // Handler for filter selection, updating the search input and resetting search
  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  // Main component return, laying out the search functionality, filters, and image display
  return (
    <div className='container'>
      <h1 className='title'>Image Explorer</h1>
      <div className='search-section'>
        <Form onSubmit={handleSearch}>
          <Form.Control
            type='search'
            placeholder='Type something to search...'
            className='search-input'
            ref={searchInput}
          />
        </Form>
      </div>

      {/* Display error message if it exists */}
      {errorMsg && <div className="error-message">{errorMsg}</div>}
      
      {/* Filter buttons */}
      <div className='filters'>
        <div onClick={() => handleSelection('brown')}>Brown</div>
        <div onClick={() => handleSelection('lava')}>Lava</div>
        <div onClick={() => handleSelection('ocean')}>Ocean</div>
        <div onClick={() => handleSelection('space')}>Space</div>
        <div onClick={() => handleSelection('cats')}>Cats</div>
        <div onClick={() => handleSelection('orca')}>Orca</div>
        <div onClick={() => handleSelection('dogs')}>Dogs</div>
      </div>
      
      {/* Conditional rendering for loading state or image display */}
      {loading ? (
        <p className='loading'>Loading...</p>
      ) : (
        <>
          <div className='images'>
            {images.map((image) => (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                className='image'
              />
            ))}
          </div>
          {/* Pagination buttons */}
          <div className='buttons'>
            {page > 1 && (
              <Button onClick={() => setPage(page - 1)}>Previous</Button>
            )}
            {page < totalPages && (
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
