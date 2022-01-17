import React, { ReactElement } from "react";
import { GoogleLogin } from "react-google-login";
import {
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useCustomGoogleLogin } from "../hooks";
import { useGoogleLoginMutation } from "../api/auth";

/**
 * Displays and handles Google Login
 * @deprecated
 * After upgrading to Auth0
 */
export default function Login(): ReactElement {
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
    // Login
    // const error = context.auth.login(loginRes?.data?.googleLogin as string)
    // if (!error) history.push("/");
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
