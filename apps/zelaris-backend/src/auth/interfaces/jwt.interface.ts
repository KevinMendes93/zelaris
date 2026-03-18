export interface JwtPayload {
  sub: number;
  cpf: string;
  roles: string[];
}
export interface ResetTokenPayload {
  sub: number;
  typ: string;
  exp: number;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
