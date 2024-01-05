import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const unsplashApiKey = "wqNG98GVahCxppdlA52DHjqEyEEBv1s_kBWGmDcTd8k";

const Home = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(12);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  useEffect(() => {
    const fetchInitialImages = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://api.unsplash.com/photos?page=${page}&count=12`,
          {
            headers: {
              Authorization: `Client-ID ${unsplashApiKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const imageData = await response.json();
        setImages((prevImages) => [...prevImages, ...imageData]);
      } catch (error) {
        console.error("Error fetching initial images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialImages();
  }, [page]);

  const handleLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 2);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setSearchPage(1);
    setImages([]);
    setPage(1);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=${searchPage}&query=${searchTerm}`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashApiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const searchData = await response.json();
      setNewImages(searchData.results);
    } catch (error) {
      console.error("Error fetching search images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <img src={logo} alt="" className="logo" />
        <Link className="favorite" to="/favorites">
          <FaRegHeart className="heartIcon" />
          <h2>Избранное</h2>
        </Link>
      </header>
      <form className="search-container" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Поиск"
          className="search-input"
          onChange={handleSearchChange}
        />
      </form>

      {(searchTerm ? newImages : images).length > 0 && (
        <div>
          <div className="image-container">
            {(searchTerm ? newImages : images).map((image, index) => (
              <Link
                key={index}
                to={{
                  pathname: `/photos/${image.id}`,
                  state: { clientId: unsplashApiKey },
                }}
              >
                <div className="parser" onClick={() => handlePhotoClick(image)}>
                  <img src={image.urls.regular} alt={image.alt_description} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="loader">
        {loading && <p>Loading...</p>}

        <button 
        onClick={handleLoadMoreClick} 
        disabled={loading} 
        style={{
          padding: "10px 20px",
          fontWeight: "bold",
          fontSize: "20px"
        }}
        >
          Загрузить еще
        </button>
      </div>
    </>
  );
};

export default Home;
