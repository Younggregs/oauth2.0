import { Request, Response } from "express";
import JWTService from "../utils/jwt";
import { ALLOWED_CLIENT_IDS } from "../constants";
import {
  AuthorizationRequest,
  TokenRequest,
  TokenResponse,
} from "@/types/auth";

/**
 * AuthController class to handle OAuth 2.0 authorization and token generation.
 */
class AuthController {
  /**
   * Generates an authorization code and redirects the user to the provided redirect URI with the code.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public async getAuthorizationCode(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { response_type, client_id, redirect_uri, state } =
        req.query as unknown as AuthorizationRequest;

      // Validate all required parameters are present, state is optional.
      if (!client_id || !response_type || !redirect_uri) {
        res.redirect(
          `${redirect_uri}?error=invalid_request&error_description=missing_required_parameters${
            state ? `&state=${state}` : ""
          }`,
        );
        return;
      }

      // Check if response type is code.
      if (response_type !== "code") {
        res.redirect(
          `${redirect_uri}?error=unsupported_response_type&error_description=Only code response type is supported${
            state ? `&state=${state}` : ""
          }`,
        );
        return;
      }

      // Check if client ID is valid.
      if (!ALLOWED_CLIENT_IDS.includes(client_id)) {
        res.redirect(
          `${redirect_uri}?error=unauthorized_client&error_description=Client ID is not authorized${
            state ? `&state=${state}` : ""
          }`,
        );
        return;
      }

      // Generate authorization code.
      const code = await JWTService.generateAuthorizationCode(
        client_id,
        redirect_uri,
      );

      // Construct redirect URL with authorization code.
      const redirect_url = new URL(redirect_uri as string);
      redirect_url.searchParams.append("code", code);
      if (state) {
        redirect_url.searchParams.append("state", state as string);
      }

      // Redirect to client application.
      res.redirect(302, redirect_url.toString());
    } catch {
      res.status(500).json({ error: "server_error" });
    }
  }

  /**
   * Generates an access token and refresh token using the provided authorization code.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public async getAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const { grant_type, code, redirect_uri, client_id } =
        req.body as TokenRequest;

      // Validate grant type.
      if (grant_type !== "authorization_code") {
        res.status(400).json({
          error: "unsupported_grant_type",
          error_description: "Only authorization_code grant type is supported",
        });
        return;
      }

      // Verify authorization code.
      const decoded_payload = await JWTService.verifyAuthorizationCode(code);
      if (!decoded_payload) {
        res.status(400).json({
          error: "invalid_grant",
          error_description: "Invalid authorization code",
        });
        return;
      }

      // Calculate time until token expiration, by subtracting the current time from the expiration time.
      const expires_in =
        (decoded_payload.exp as number) - Math.floor(Date.now() / 1000);

      // Generate access and refresh tokens.
      const access_token = await JWTService.generateAccessToken(
        client_id,
        redirect_uri,
      );
      const refresh_token = await JWTService.generateRefreshToken(
        client_id,
        redirect_uri,
      );

      // Send access token and refresh token in response.
      res.status(200).json({
        access_token,
        token_type: "bearer",
        expires_in,
        refresh_token,
      } as TokenResponse);
    } catch {
      res.status(400).json({
        error: "invalid_request",
        error_description: "Invalid request parameters",
      });
    }
  }
}

export default new AuthController();
