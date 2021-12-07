import React, { ReactElement } from "react";
import { GoogleLogin } from "react-google-login";
import {
  useToast,
  UseToastOptions,
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context";
import { useCustomGoogleLogin } from "../hooks";
import { useGoogleLoginMutation } from "../api/auth";

/**
 * Displays and handles Google Login
 */
export default function Login(): ReactElement {
  const context = useAppContext();
  const toast = useToast();
  const history = useHistory();

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
  const [serverLogin, { loading }] = useGoogleLoginMutation()
  /**
   * Successful fetch
   */
  const [clientIDError, { onSuccess, onFailure, clientId }] =
    useCustomGoogleLogin();
  if (clientIDError) return clientIDError;

  const customOnSuccess = async (res: any) => {
    onSuccess(res);
    const loginRes = await serverLogin({
      variables: {
        googleId: res.googleId
      }
    })
    console.log("[Successful request] Google login.");
    customToast();
    const userData = {
      userId: loginRes?.data?.googleLogin?.id as string,
      userName: loginRes?.data?.googleLogin?.name as string,
    };
    // Login
    context.dispatch({ type: "LOGIN", data: userData });
    history.push("/");
  }

  return (
    <Box h="100%">
      <Flex align="center" direction="column">
        {loading && (
          <Heading mt="2%" size="md">
            Loading, please wait...
          </Heading>
        )}
        <Box mt="2%">
          <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={customOnSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
          />
        </Box>
      </Flex>
    </Box>
  );
}
