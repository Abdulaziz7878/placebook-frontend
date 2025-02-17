import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../../shared/components/UIElements/avatar/Avatar";
import Card from "../../../shared/components/UIElements/card/Card";
import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card style={{ padding: 0 }}>
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar
              image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.name}
            />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "place" : "places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
