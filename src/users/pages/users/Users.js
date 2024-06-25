import React, { useEffect, useState } from "react";
import UsersList from "../../components/usersList/UsersList";
import ErrorModal from "../../../shared/components/UIElements/errorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/loadingSpinner/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook/http-hook";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  useEffect(() => {
    const sendRequestLocal = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    sendRequestLocal();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center" style={{ minHeight: "70vh" }}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
