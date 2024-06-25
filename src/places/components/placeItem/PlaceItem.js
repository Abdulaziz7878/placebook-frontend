import React, { useState, useContext } from "react";

import Card from "../../../shared/components/UIElements/card/Card";
import Button from "../../../shared/components/formElements/button/Button";
import { AuthenticateContext } from "../../../shared/context/authenticateContext";
import { useHttpClient } from "../../../shared/hooks/http-hook/http-hook";
import ErrorModal from "../../../shared/components/UIElements/errorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/loadingSpinner/LoadingSpinner";
import Modal from "../../../shared/components/UIElements/modal/Modal";
// import Map from "../../../shared/components/UIElements/map/Map";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const placeId = props.id;
  const auth = useContext(AuthenticateContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const openDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const closeDeleteWarningHandler = () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async () => {
    try {
      const url = process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`;
      const method = "DELETE";
      const headers = { Authorization: "Bearer " + auth.token };

      await sendRequest(url, method, null, headers);

      props.onDelete(placeId);
    } catch {}
    setShowConfirmModal(false);
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <img
            style={{ width: "100%", height: "100%" }}
            alt="MAP"
            src="https://cdn.shopify.com/s/files/1/1568/8443/products/main_Map_Of_The_World_Multi_Panel_Canvas_Wall_Art.jpg?crop=center&height=1024&v=1618969335&width=1024"
          />
          {/* <Map center={props.coordinates} zoom={16} /> */}
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={closeDeleteWarningHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeDeleteWarningHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <p>
          do you want to delete this place? Please note that it can't be undone
          there after.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={openDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
