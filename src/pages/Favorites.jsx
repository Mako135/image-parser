import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Favorites = () => {
  const [favoritePhotos, setFavoritePhotos] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      // Parse the stored favorites and filter out duplicates based on ID
      const uniqueFavorites = Array.from(
        new Set(JSON.parse(storedFavorites).map((favorite) => favorite.id))
      ).map((id) =>
        JSON.parse(storedFavorites).find((favorite) => favorite.id === id)
      );

      setFavoritePhotos(uniqueFavorites);
    }
  }, []);

  return (
    <div className="favorite-photos">
      <header>
        <img src={logo} alt="" />
        <div className="section-2">
          <Link className="search" to="/">
            <IoSearchSharp className="searchIcon" />
            <h2>Поиск</h2>
          </Link>
          <Link className="favorite" to="/favorites">
            <FaRegHeart className="heartIcon" />
            <h2>Избранное</h2>
          </Link>
        </div>
      </header>
      <div className="image-container">
        {favoritePhotos.map((favoritePhoto, index) => (
          <div key={index} className="parser">
            {favoritePhoto.urls && favoritePhoto.urls.regular && (
              <img
                src={favoritePhoto.urls.regular}
                alt={favoritePhoto.alt_description}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
