import React, { ReactElement } from "react";
import { GoogleLogin } from "react-google-login";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function Register(): ReactElement {
  const onSuccess = (res: any) => {
    console.log("[Login Success] res:", res);
  };
  const onFailure = (res: any) => {
    console.log("[Login Failed] res:", res);
  };
  if (!clientId)
    return (
      <p>
        Please provide REACT_APP_GOOGLE_CLIENT_ID enviorment variable to use the
        Google login feature.
      </p>
    );

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
    />
  );
}
