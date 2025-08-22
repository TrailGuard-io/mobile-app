export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface Rescue {
  id: number;
  latitude: number;
  longitude: number;
  message: string | null;
  status: string;
  createdAt: string;
  userId?: number;
  user?: User;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}