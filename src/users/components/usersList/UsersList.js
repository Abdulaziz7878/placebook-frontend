import React from "react";

import UserItem from "../userItem/UserItem";
import Card from "../../../shared/components/UIElements/card/Card";
import "./UsersList.css";

const UsersList = (props) => {
  if (!props.items.length) {
    return (
      <div className="center">
        <Card>
          <h2>No user found!</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
