export interface JwtPayload {
  sub: string;
  type: 'user' | 'admin';
  role?: string;
}
