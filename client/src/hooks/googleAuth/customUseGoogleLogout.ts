import { ReactElement } from "react";
import {
  useGoogleLogout,
  UseGoogleLogoutProps,
  UseGoogleLogoutResponse,
} from "react-google-login";
import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useAppContext } from "../../config";
import useGoogleClientId from "./useGoogleClientId";

/**
 * This hook will:
 * - Handle feedback with ChakraUI toasts
 * - Logout with context.dispatch
 *
 * Returns [error_component, UseGoogleLogoutResponse]
 * Please return *error_component* if exist
 */
export default function (
  props?: Partial<UseGoogleLogoutProps>
): [ReactElement | null, Partial<UseGoogleLogoutResponse>] {
  //   const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const context = useAppContext();
  const [clientIdError, clientId] = useGoogleClientId();

  const toast = useToast();
  const customToast = (
    title = "Success logout.",
    status: UseToastOptions["status"] = "success",
    dsc = "Success Logout desc."
  ) =>
    toast({
      title: title,
      description: dsc,
      status: status,
      duration: 9000,
      isClosable: true,
    });

  if (clientIdError) {
    return [clientIdError, {}];
  }

  const onLogoutSuccess = () => {
    customToast();
    context.dispatch({ type: "LOGOUT" });
  };
  const onFailure = () => {
    customToast("Logout error.", "error", "Google error");
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
