import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to check if the user is logged in based on the presence of a token
    const checkLoggedIn = () => {
      const token = localStorage.getItem("token");
      return !!token; // Returns true if the token is present, indicating the user is logged in
    };

    // Check if the user is logged in
    const loggedIn = checkLoggedIn();

    // Update state
    setIsLoggedIn(loggedIn);
    setLoading(false);
  }, []);

  if (loading) {
    // Wait until authentication is complete
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
