import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

const unsplashApiKey = "wqNG98GVahCxppdlA52DHjqEyEEBv1s_kBWGmDcTd8k";

export const ItemPage = () => {
  const { id } = useParams();
  const [photoData, setPhotoData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/photos/${id}`,
          {
            headers: {
              Authorization: `Client-ID ${unsplashApiKey}`,
            },
          }
        );

        const photoData = response.data;
        console.log(photoData);
        setPhotoData(photoData);

        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.includes(id));
      } catch (error) {
        console.error("Error fetching photo data:", error);
      }
    };

    fetchPhotoData();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite((prevIsFavorite) => {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (prevIsFavorite) {
        const updatedFavorites = favorites.filter(
          (favorite) => favorite.id !== id
        );
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      } else {
        const photoToAdd = { id, ...photoData };
        localStorage.setItem(
          "favorites",
          JSON.stringify([...favorites, photoToAdd])
        );
      }

      return !prevIsFavorite;
    });
  };

  const handleDownload = () => {
    saveAs(photoData.urls.full, `${id}.jpg`);
  };

  if (!photoData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="item-page">
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
      <div
        className="item-container"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.3), rgba(0, 0, 0, 0.8)) url(${photoData.urls.regular})`,
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="item-info">
          <div className="item-details">
            <div className="user-info">
              <img src={photoData.user.profile_image.medium} alt="" />
              <div className="username">
                <h2>{photoData.user.name}</h2>
                <p>@{photoData.user.instagram_username}</p>
              </div>
            </div>
            <div className="buttons">
              <button onClick={toggleFavorite} className="like">
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
              <button onClick={handleDownload} className="download">
                <FiDownload />
                <h2>Download</h2>
              </button>
            </div>
          </div>
          <img
            src={photoData.urls.regular}
            alt={photoData.alt_description}
            style={{}}
          />
        </div>
      </div>
    </div>
  );
};
