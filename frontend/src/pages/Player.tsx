import React, { useEffect, useState } from "react";
import axios from "axios";
import PlayerCard from "../components/PlayerCard";
import { useRecoilValue } from "recoil";
import { userEmail } from "../store/atoms/user";

const App = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [category, setCategory] = useState("All");
  const email = useRecoilValue(userEmail);
  const fetchPlayers = () => {
    axios
      .get("http://localhost:3000/players/not-sold")
      .then((res) => {
        setPlayers(res.data);
        filterPlayers(res.data, category);
      })
      .catch((error) => console.error("Error fetching players:", error));
  };

  const handleBuy = (playerId: any) => {
    const buyerEmail = email;
    axios
      .post("http://localhost:3000/purchase", { buyerEmail, playerId })
      .then(() => {
        fetchPlayers();
      })
      .catch((error) => console.error("Error purchasing player:", error));
  };

  const filterPlayers = (players: any, category: any) => {
    if (category === "All") {
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers(
        players.filter((player: any) => player.category === category)
      );
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    filterPlayers(players, category);
  }, [players, category]);

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  return (
    <div className="app">
      <div className="filter">
        <label htmlFor="category">Filter by category: </label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="All">All</option>
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
        </select>
      </div>
      <div className="player-list">
        {filteredPlayers.map((player) => (
          <PlayerCard
            //@ts-ignore
            key={player.id}
            player={player}
            //@ts-ignore
            onBuy={() => handleBuy(player.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
