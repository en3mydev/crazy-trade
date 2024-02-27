import WatchlistTable from "./WatchlistTable";
import { useEffect, useState } from "react";
import axios from "axios";
import YourAssetsTableWithSell from "./YourAssetsTableWithSell";

const Trade = () => {
  const [userProfile, setUserProfile] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://crazy-trade-server.vercel.app/user/${userId}`
        );

        setUserProfile(response.data);
        setDataLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="trade-page">
      <YourAssetsTableWithSell
        userProfile={userProfile}
        dataLoaded={dataLoaded}
      />
      <WatchlistTable />
    </div>
  );
};

export default Trade;
