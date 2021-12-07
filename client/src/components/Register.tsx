import React, { ReactElement, useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { GoogleLogin } from "react-google-login";
import { Link } from "react-router-dom";
import { useCustomGoogleLogin } from "../hooks";
import { useRegisterMutation, IRegisterMutationVars } from "../api/auth";

export default function Register(): ReactElement {
  const [showAlert, setShowAlert] = useState(false);

  const [serverRegister, { loading }] = useRegisterMutation()
  
  const [clientIDError, { onSuccess, onFailure, clientId }] =
  useCustomGoogleLogin();
  if (clientIDError) return clientIDError;
  
  const customOnSuccess = async (res: any) => {
    onSuccess(res);
    const userContent: IRegisterMutationVars['userContent'] = {
      googleId: res.profileObj.googleId,
      email: res.profileObj.email,
      name: res.profileObj.name,
    };
    const registerRes = await serverRegister({ variables: { userContent } })
    !registerRes.errors && setShowAlert(true)
    console.log("[Successful request] Register with google.");
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
        </Alert>
      )}
      <Flex align="center" direction="column">
        {loading && (
          <Heading mt="2%" size="md">
            Loading, please wait...
          </Heading>
        )}
        <Box mt="2%">
          <GoogleLogin
            clientId={clientId}
            buttonText="Register"
            onSuccess={customOnSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
          />
        </Box>
      </Flex>
    </Box>
  );
}
