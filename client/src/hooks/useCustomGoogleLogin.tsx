import React, { useState, ReactElement, useEffect } from "react";
import { useToast, UseToastOptions } from "@chakra-ui/react";
import { GoogleLoginProps } from "react-google-login";
import useGoogleClientId from "./useGoogleClientId";

interface SimpleGoogleLoginProps {
  onSuccess: (res: any) => void;
  onFailure: GoogleLoginProps["onFailure"];
  clientId: string;
}

/**
 * This hook will:
 * - Handle feedback with ChakraUI toasts
 * - Log errors
 * - Handle google client id
 *
 * Returns [error_component, UseGoogleLoginResponse]
 * Please return *error_component* if exist
 *
 * @BUGS
 * - googleResponse state (see *Infinite fetch when Google Login*)
 */
export default function useCustomGoogleLogin(): [
  ReactElement | null,
  any | null,
  SimpleGoogleLoginProps
] {
  const [googleResponse, setGoogleResponse] = useState(null);
  useEffect(() => {
    console.log("[Hook][useCustomGoogleLogin][RENDERED]");
    if (googleResponse) {
      setGoogleResponse(null);
    }
  });
  const [clientIdError, clientId] = useGoogleClientId();

  const toast = useToast();

  const customToast = (
    title = "Google login success.",
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
   * Function called when Google login success
   *
   * Bug:
   * - Trying to change this function's type to GoogleLoginProps["onSuccess"], doesn't let me
   * get the res.googleId property. It say that doesn't satisfy GoogleLoginResponseOffline type
   */
  const onSuccess = (res: any) => {
    console.log("[Google Login Success] res:", res);
    setGoogleResponse(res);
  };

  /**
   * Function called when Google login fails
   */
  const onFailure: GoogleLoginProps["onFailure"] = (res) => {
    console.log("[Google Login Failed] res:", res);
    customToast("Google Login error", "error", "Google error");
    setGoogleResponse(null);
  };
  /**
   * Change this to a hook like useGoogleClientID
   * Why?:
   * This same logic is used in others hooks (useCustomGoogleLogout or something like that)
   *
   */
  /* if (!clientId) {
    const error = (
      <p>
        Please provide REACT_APP_GOOGLE_CLIENT_ID enviorment variable to use the
        Google authentication feature.
      </p>
    );
    return [error, googleResponse, { onSuccess, onFailure, clientId: "" }];
  } */

  if (clientIdError) {
    return [clientIdError, googleResponse, { onSuccess, onFailure, clientId }];
  }

  return [null, googleResponse, { onSuccess, onFailure, clientId }];
}
