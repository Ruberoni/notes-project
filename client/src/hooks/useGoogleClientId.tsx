import React, { ReactElement } from "react";

/**
 *
 * Checks if the envoirment variable REACT_APP_GOOGLE_CLIENT_ID is set.
 * @return [error, clientId]
 * error exist if there isn't REACT_APP_GOOGLE_CLIENT_ID set
 * error is a ReactElement, so, if error exist, you can render it.
 *
 * @todo
 * - Use react states
 */
export default function (): [undefined | ReactElement, string] {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
  let error: undefined | ReactElement;
  if (!clientId) {
    error = (
      <p>
        Please provide REACT_APP_GOOGLE_CLIENT_ID enviorment variable to use the
        Google authentication feature.
      </p>
    );
  }
  return [error, clientId];
}
