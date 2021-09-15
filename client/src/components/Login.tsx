import React, { ReactElement } from "react";
import { GoogleLogin, GoogleLoginProps } from "react-google-login";
import { useMutation } from "@apollo/client";
import { GOOGLE_LOGIN } from "../utils/queries";
import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useAppContext } from "../config";

/**
 * Displays and handles Google Login
 */
export default function Login(): ReactElement {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

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

  /**
   * data: googleLogin{ id, googleId, email, name }
   * onError: if useMutation returns an error, this is thrown, so makes the React server to shutdown
   */
  const [serverLogin, { data, loading, error }] = useMutation(GOOGLE_LOGIN, {
    onError: (err) => console.log("[Network error]: error", err),
  });
  if (error) {
    customToast("Login error.", "error", "Server error");
  }
  if (data) {
    console.log("[useMutation][GOOGLE_LOGIN] data:", data);
    customToast();
    const userData = {
      userId: data.googleLogin?.id,
      userName: data.googleLogin?.name,
    };
    // Login
    context.dispatch({ type: "LOGIN", data: userData });
  }
  /**
   * Function called when Google login success
   *
   * Bug:
   * - Trying to change this function's type to GoogleLoginProps["onSuccess"], doesn't let me
   * get the res.googleId prperty. It say that doesn't satisfy GoogleLoginResponseOffline type
   */
  const onSuccess = (res: any) => {
    console.log("[Login Success] res:", res);
    const googleId = res.googleId;
    serverLogin({
      variables: { googleId },
    });
  };

  /**
   * Function called when Google login fails
   */
  const onFailure: GoogleLoginProps["onFailure"] = (res) => {
    console.log("[Login Failed] res:", res);
    customToast("Login error.", "error", "Google error");
  };
  if (!clientId)
    return (
      <p>
        Please provide REACT_APP_GOOGLE_CLIENT_ID enviorment variable to use the
        Google authentication feature.
      </p>
    );

  return (
    <>
      {loading && <p>Loading, plese wait...</p>}
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
}
