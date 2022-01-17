import jwksRsa from "jwks-rsa";
import { ServerAuthScheme, Lifecycle, Request, ResponseToolkit } from "@hapi/hapi";
import { getBearerValue } from "../utils";
import { Boom } from "@hapi/boom";
import { Options as hapiJwtOptions } from "hapi-auth-jwt2";

export const jwtStrategyOptions: hapiJwtOptions = {
  // Get the complete decoded token, because we need info from the header (the kid)
  complete: true,

  headerKey: "authorization",
  tokenType: "Bearer",

  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
  key: jwksRsa.hapiJwt2KeyAsync({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // User validation is done in Auth0 and AuthChecker.
  validate: () => {
    return {
      isValid: true,
    };
  },

  // Validate the audience and the issuer.
  verifyOptions: {
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
  },
};

/**
 * Authenticates a client using a known secret in the `Authorization` header using Bearer scheme
 */
export const basicSecretScheme: ServerAuthScheme = () => {
  const authenticate = (request: Request, h: ResponseToolkit): Lifecycle.ReturnValue => {
    const authHeader = request.headers.authorization;
    const bearerValue = getBearerValue(authHeader);
    if (bearerValue !== process.env.BASIC_SECRET) throw new Boom("There was an error anthenticating");
    return h.authenticated({
      credentials: {},
    });
  };
  return {
    authenticate,
  };
};
