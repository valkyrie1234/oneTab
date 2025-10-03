/**
 * Типы для API ответов
 */

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  level: number;
  xp: number;
  gold: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface IApiErrorResponse {
  success: false;
  error: string;
}

export type IApiResponse<T> = IApiSuccessResponse<T> | IApiErrorResponse;

// Auth responses
export interface IAuthLoginResponse {
  message: string;
  user: IUser;
  tokens: ITokens;
}

export interface IAuthRegisterResponse {
  message: string;
  user: IUser;
  tokens: ITokens;
}

export interface IAuthMeResponse {
  user: IUser;
}

