import React, { ReactElement } from "react";
import { GoogleLogin } from "react-google-login";
import { useMutation } from "@apollo/client";
import { GOOGLE_LOGIN } from "../utils/queries";
import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useAppContext } from "../context";
import { useCustomGoogleLogin } from "../hooks";

/**
 * Displays and handles Google Login
 */
export default function Login(): ReactElement {
  const context = useAppContext();
  const toast = useToast();

  const customToast = (
    title = "Success login.",
    status: UseToastOptions["status"] = "success",
    dsc = "Success Login desc."
  ) =>
    toast({
      title: title,
      description: dsc,
      status: status,
      duration: 9000,
      isClosable: true,
    });

  function onError(err: any) {
    console.log("[Network error] Google login. error:", err);
    customToast("Login error", "error", "");
  }
  /**
   * data: googleLogin{ id, googleId, email, name }
   * onError: if useMutation returns an error, this is thrown, so makes the React server to shutdown
   */
  const [serverLogin, { data, loading }] = useMutation(GOOGLE_LOGIN, {
    onError,
  });
  /**
   * Successful fetch
   */
  const [clientIDError, { onSuccess, onFailure, clientId }] =
    useCustomGoogleLogin();
  if (clientIDError) return clientIDError;

  function customOnSuccess(res: any) {
    onSuccess(res);
    serverLogin({ variables: { googleId: res.googleId } }).then((res) => {
      console.log("[Successful request] Google login.");
      customToast();
      const userData = {
        userId: res.data.googleLogin?.id,
        userName: res.data.googleLogin?.name,
      };
      // Login
      context.dispatch({ type: "LOGIN", data: userData });
    });
  }

  return (
    <>
      {loading && <p>Loading, plese wait...</p>}
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={customOnSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
}
