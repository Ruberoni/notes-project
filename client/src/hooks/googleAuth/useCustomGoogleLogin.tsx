import { ReactElement, useEffect } from "react";
import { GoogleLoginProps } from "react-google-login";
import useGoogleClientId from "./useGoogleClientId";

interface SimpleGoogleLoginProps {
  onSuccess: (a: any) => void;
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
 * * @deprecated
 * After upgrading to Auth0
 *
 * @BUGS
 * - googleResponse state (see *Infinite fetch when Google Login*)
 */
export default function useCustomGoogleLogin(): [
  ReactElement | null,
  SimpleGoogleLoginProps
] {
  useEffect(() => {
    console.log("[Hook][useCustomGoogleLogin][RENDERED]");
  });
  const [clientIdError, clientId] = useGoogleClientId();
  /**
   * Function called when Google login success
   *
   * Bug:
   * - Trying to change this function's type to GoogleLoginProps["onSuccess"], doesn't let me
   * get the res.googleId property. It say that doesn't satisfy GoogleLoginResponseOffline type
   */
  const onSuccess = (res: any) => {
    console.log("[Google Login Success] res:", res);
  };

  /**
   * Function called when Google login fails
   */
  const onFailure: GoogleLoginProps["onFailure"] = (res) => {
    console.log("[Google Login Failed] res:", res);
  };

  if (clientIdError) {
    return [clientIdError, { onSuccess, onFailure, clientId }];
  }

  return [null, { onSuccess, onFailure, clientId }];
}
