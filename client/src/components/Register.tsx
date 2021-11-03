import React, { ReactElement, useState } from "react";
import {
  useToast,
  UseToastOptions,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import { GoogleLogin } from "react-google-login";
import { useMutation, ApolloError } from "@apollo/client";
import { Link } from 'react-router-dom'
import { useCustomGoogleLogin } from "../hooks";
import { GOOGLE_REGISTER } from "../utils/queries";

export default function Register(): ReactElement {
  const [showAlert, setShowAlert] = useState(false);
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

  function onError(err: ApolloError) {
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
    serverRegister({ variables: { userContent } }).then((res) => !res.errors && setShowAlert(true));
  }

  return (
    <Box h="100%">
      {showAlert && (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle mr={2}>Successful register!</AlertTitle>
          <AlertDescription>
            <Link to="/login">Go to login page</Link>
          </AlertDescription>
          {/* <CloseButton position="absolute" right="8px" top="8px" /> */}
        </Alert>
      )}
      {loading && <p>Loading, plese wait...</p>}
      <GoogleLogin
        clientId={clientId}
        buttonText="Register"
        onSuccess={customOnSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    </Box>
  );
}
