import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../../shared/components/formElements/input/Input";
import Button from "../../../shared/components/formElements/button/Button";
import Card from "../../../shared/components/UIElements/card/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/formHook/form-hook";
import { AuthenticateContext } from "../../../shared/context/authenticateContext";
import { useHttpClient } from "../../../shared/hooks/http-hook/http-hook";
import ErrorModal from "../../../shared/components/UIElements/errorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/loadingSpinner/LoadingSpinner";
import "../newPlace/PlaceForm.css";

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const auth = useContext(AuthenticateContext);
  const [loadedPlace, setLoadedPlace] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`;
        const responseData = await sendRequest(url);
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const history = useHistory();

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`;
      const method = "PATCH";
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      };
      const body = JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      });
      await sendRequest(url, method, body, headers);
      history.push(`/${auth.userId}/places`);
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="center" style={{ minHeight: "70vh" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            type="text"
            element="input"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={InputHandler}
            value={loadedPlace.title}
            valid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min length 5 character)"
            onInput={InputHandler}
            value={loadedPlace.description}
            valid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
