import React, { useContext } from "react";

import { AuthenticateContext } from "../../../shared/context/authenticateContext";
import Card from "../../../shared/components/UIElements/card/Card";
import PlaceItem from "../placeItem/PlaceItem";
import Button from "../../../shared/components/formElements/button/Button";
import "./PlaceList.css";

const PlaceList = (props) => {
  const auth = useContext(AuthenticateContext);
  if ((!props.items || !props.items.length) && auth.userId === props.userId) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => {
        return (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
            onDelete={props.onDeletePlace}
          />
        );
      })}
    </ul>
  );
};

export default PlaceList;
