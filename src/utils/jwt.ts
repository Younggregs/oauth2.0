import { SignJWT, jwtVerify, JWTPayload } from "jose";
import crypto from "crypto";

/**
 * JWTService class to handle JWT generation and verification.
 */
class JWTService {
  private ALGORITHM = "HS256";
  private secret: Buffer;

  /**
   * Constructor to initialize the JWTService with a secret key.
   */
  constructor() {
    this.secret = crypto.randomBytes(32);
  }

  /**
   * Generates a JWT token with the specified parameters.
   * @param clientId - The client ID.
   * @param redirect_uri - The redirect URI.
   * @param expirationTime - The expiration time of the token.
   * @returns A promise that resolves to the generated JWT token.
   */
  private async generateToken(
    clientId: string,
    redirect_uri: string,
    expirationTime: string,
  ): Promise<string> {
    return await new SignJWT({ clientId, redirect_uri })
      .setProtectedHeader({ alg: this.ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(this.secret);
  }

  /**
   * Generates an authorization code with a short expiration time.
   * @param client_id - The client ID.
   * @param redirect_uri - The redirect URI.
   * @returns A promise that resolves to the generated authorization code.
   */
  public async generateAuthorizationCode(
    client_id: string,
    redirect_uri: string,
  ): Promise<string> {
    return this.generateToken(client_id, redirect_uri, "10m");
  }

  /**
   * Verifies the provided authorization code.
   * @param code - The authorization code to verify.
   * @returns A promise that resolves to the JWT payload if the code is valid, or null if it is not.
   */
  public async verifyAuthorizationCode(
    code: string,
  ): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(code, this.secret);
      return payload;
    } catch {
      return null;
    }
  }

  /**
   * Generates an access token with a longer expiration time.
   * @param client_id - The client ID.
   * @param redirect_uri - The redirect URI.
   * @returns A promise that resolves to the generated access token.
   */
  public async generateAccessToken(
    client_id: string,
    redirect_uri: string,
  ): Promise<string> {
    return this.generateToken(client_id, redirect_uri, "1h");
  }

  /**
   * Generates a refresh token with an even longer expiration time.
   * @param client_id - The client ID.
   * @param redirect_uri - The redirect URI.
   * @returns A promise that resolves to the generated refresh token.
   */
  public async generateRefreshToken(
    client_id: string,
    redirect_uri: string,
  ): Promise<string> {
    return this.generateToken(client_id, redirect_uri, "1d");
  }

  /**
   * Verifies the provided access token.
   * @param token - The access token to verify.
   * @returns A promise that resolves to the JWT payload if the token is valid, or null if it is not.
   */
  public async verifyAccessToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.secret);
      return payload;
    } catch {
      return null;
    }
  }

  /**
   * Verifies the provided refresh token.
   * @param token - The refresh token to verify.
   * @returns A promise that resolves to the JWT payload if the token is valid, or null if it is not.
   */
  public async verifyRefreshToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.secret);
      return payload;
    } catch {
      return null;
    }
  }
}

export default new JWTService();
