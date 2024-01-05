import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <div className="error">
        <h1 className="error-title">#404</h1>
        <p className="error-subtitle">Страница не найдена!</p>
        <Link to="/">
          <button>На главную страницу</button>
        </Link>
      </div>
    </>
  );
};

export default ErrorPage;
