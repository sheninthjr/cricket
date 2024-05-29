import React from "react";
import PropTypes from "prop-types";
//@ts-ignore
const PlayerCard = ({ player, onBuy }) => {
  return (
    <div className="player-card">
      <h2 className="player-name">
        {player.firstName} {player.lastName}
      </h2>
      <p>
        <strong>Age:</strong> {player.age}
      </p>
      <p>
        <strong>Matches:</strong> {player.matches}
      </p>
      <p>
        <strong>Category:</strong> {player.category}
      </p>
      <p>
        <strong>Career Best:</strong> {player.careerBest}
      </p>
      <p>
        <strong>Base Price:</strong> {player.basePrice} Cr
      </p>
      <button onClick={onBuy}>Buy</button>
    </div>
  );
};

PlayerCard.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    matches: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    careerBest: PropTypes.string.isRequired,
    basePrice: PropTypes.number.isRequired,
  }).isRequired,
  onBuy: PropTypes.func.isRequired,
};

export default PlayerCard;
