import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider, Auth0ProviderOptions } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  if (!domain || !clientId)
    throw new Error(
      "Please set REACT_APP_AUTH0_DOMAIN and REACT_APP_AUTH0_CLIENT_ID env. variables"
    );

  const history = useHistory();

  const onRedirectCallback: Auth0ProviderOptions["onRedirectCallback"] = (
    appState
  ) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
