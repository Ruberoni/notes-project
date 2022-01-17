import { ReactElement } from "react";
import {
  useGoogleLogout,
  UseGoogleLogoutProps,
  UseGoogleLogoutResponse,
} from "react-google-login";
import useGoogleClientId from "./useGoogleClientId";

/**
 * This hook will:
 * - Handle feedback with ChakraUI toasts
 * - Logout with context.dispatch
 *
 * Returns [error_component, UseGoogleLogoutResponse]
 * Please return *error_component* if exist
 *
 * @deprecated
 * After upgrading to Auth0
 */
export default function customuseGoogleLogout(
  props?: Partial<UseGoogleLogoutProps>
): [ReactElement | null, Partial<UseGoogleLogoutResponse>] {
  //   const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [clientIdError, clientId] = useGoogleClientId();

  if (clientIdError) {
    return [clientIdError, {}];
  }

  const onLogoutSuccess = () => {
    return;
  };
  const onFailure = () => {
    return;
  };

  return [
    null,
    useGoogleLogout({
      clientId,
      onLogoutSuccess,
      onFailure,
      ...props,
    }),
  ];
}
