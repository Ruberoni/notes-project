import React, { ReactElement } from "react";
import { useToast, UseToastOptions } from "@chakra-ui/react";
import { GoogleLogin } from "react-google-login";
import { useMutation } from "@apollo/client";
import { useCustomGoogleLogin } from "../hooks";
import { GOOGLE_REGISTER } from "../utils/queries";

export default function Register(): ReactElement {
  const toast = useToast();

  const customToast = (
    title = "Success Register.",
    status: UseToastOptions["status"] = "success",
    dsc = "Success Register desc."
  ) =>
    toast({
      title: title,
      description: dsc,
      status: status,
      duration: 9000,
      isClosable: true,
    });

  function onError(err: any) {
    console.log("[Network error] Google register. error:", err);
    customToast("Register error", "error", "");
  }
  /**
   * onError: if useMutation returns an error, this is thrown, so makes the React server to shutdown
   */
  const [serverRegister, { data, loading }] = useMutation(GOOGLE_REGISTER, {
    onError,
  });
  if (data) {
    console.log("[useMutation][GOOGLE_REGISTER] data:", data);
    console.log("[Successful request] Register with google.");
    customToast();
    // Show a Chakra UI Alert to notify users to go to Login
  }

  const [clientIDError, { onSuccess, onFailure, clientId }] =
    useCustomGoogleLogin();
  if (clientIDError) return clientIDError;

  function customOnSuccess(res: any) {
    onSuccess(res);
    const userContent = {
      googleId: res.profileObj.googleId,
      email: res.profileObj.email,
      name: res.profileObj.name,
    };
    console.log("[Google Register] userContent", userContent);
    serverRegister({ variables: { userContent } });
  }

  return (
    <>
      {loading && <p>Loading, plese wait...</p>}
      <GoogleLogin
        clientId={clientId}
        buttonText="Register"
        onSuccess={customOnSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
}
