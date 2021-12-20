import React, { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';

export default function Test() {

  const [message, setMessage] = useState('');
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const { getAccessTokenSilently } = useAuth0()

  const callSecureApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `${serverUrl}/restricted`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseData = await response.json();

      setMessage(responseData.message);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <>
        <button
          type="button"
          onClick={callSecureApi}
        >
          Get Protected Message
        </button>
      <p>Message: { message }</p>
    </>
  )
}
