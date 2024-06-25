import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { AuthenticateContext } from "../../../shared/context/authenticateContext";
import PlaceList from "../../components/placeList/PlaceList";
import { useHttpClient } from "../../../shared/hooks/http-hook/http-hook";
import ErrorModal from "../../../shared/components/UIElements/errorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/loadingSpinner/LoadingSpinner";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const auth = useContext(AuthenticateContext);
  const userId = useParams().userId;
  useEffect(() => {
    const fetcPlaces = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`;
        const responseData = await sendRequest(url);
        setLoadedPlaces(responseData.places);
      } catch {}
    };
    fetcPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center" style={{ minHeight: "70vh" }}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (auth.userId === userId || loadedPlaces) && (
        <PlaceList
          userId={userId}
          items={loadedPlaces}
          onDeletePlace={placeDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
