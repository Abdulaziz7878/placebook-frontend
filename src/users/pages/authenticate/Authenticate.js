import React, { useState, useContext } from "react";

import { useForm } from "../../../shared/hooks/formHook/form-hook";
import Input from "../../../shared/components/formElements/input/Input";
import Button from "../../../shared/components/formElements/button/Button";
import Card from "../../../shared/components/UIElements/card/Card";
import ErrorModal from "../../../shared/components/UIElements/errorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/loadingSpinner/LoadingSpinner";
import ImageUpload from "../../../shared/components/formElements/imageUpload/ImageUpload";
import { useHttpClient } from "../../../shared/hooks/http-hook/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../shared/util/validators";
import { AuthenticateContext } from "../../../shared/context/authenticateContext";
import "./Authenticate.css";

const Authenticate = () => {
  const auth = useContext(AuthenticateContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, InputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const url = process.env.REACT_APP_BACKEND_URL + "/users/login";
        const method = "POST";
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        });
        const responseData = await sendRequest(url, method, body, headers);
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card style={{ position: "relative" }} className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? "LOGIN" : "SIGN UP"}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Full Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="please enter your name."
              onInput={InputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              errorText="Please provide an image."
              onInput={InputHandler}
            />
          )}
          <Input
            element="input"
            type="email"
            id="email"
            label="Email"
            errorText="please enter a valid email address."
            validators={[VALIDATOR_EMAIL()]}
            onInput={InputHandler}
          />
          <Input
            element="input"
            type="password"
            id="password"
            label="Password"
            errorText="please enter a valid password (at least 6 character)"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={InputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGN UP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Authenticate;
