import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../../shared/components/formElements/input/Input";
import Button from "../../../shared/components/formElements/button/Button";
import { useHttpClient } from "../../../shared/hooks/http-hook/http-hook";
import { AuthenticateContext } from "../../../shared/context/authenticateContext";
import ErrorModal from "../../../shared/components/UIElements/errorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/loadingSpinner/LoadingSpinner";
import ImageUpload from "../../../shared/components/formElements/imageUpload/ImageUpload";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/formHook/form-hook";
import "./PlaceForm.css";

const NewPlace = () => {
  const auth = useContext(AuthenticateContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const url = process.env.REACT_APP_BACKEND_URL + "/places";
      const method = "POST";
      const headers = { Authorization: "Bearer " + auth.token };

      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(url, method, formData, headers);
      history.push(`/${auth.userId}/places`);
    } catch {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please enter a valid title"
          onInput={InputHandler}
        />
        <ImageUpload
          center
          id="image"
          errorText="Please provide an image."
          onInput={InputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="please enter a description(at least 5 character)"
          onInput={InputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please enter a valid address"
          onInput={InputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
