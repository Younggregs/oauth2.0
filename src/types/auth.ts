export interface AuthorizationRequest {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  state?: string;
}

export interface TokenRequest {
  grant_type: string;
  code: string;
  redirect_uri: string;
  client_id: string;
}

export interface SuccessfulTokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  refresh_token: string;
}

export interface ErrorResponse {
  error: string;
  error_description: string;
}

export type TokenResponse = SuccessfulTokenResponse | ErrorResponse;
