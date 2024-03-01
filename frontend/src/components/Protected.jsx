import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem("token");
      return !!token;
    };

    const loggedIn = checkLoggedIn();

    setIsLoggedIn(loggedIn);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <li className="ball"></li>
        <li className="ball"></li>
        <li className="ball"></li>
      </div>
    )
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default Protected;
