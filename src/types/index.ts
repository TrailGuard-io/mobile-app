export interface User {
  id: number;
  email: string;
  name?: string;
  subscriptionType?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  avatar?: string;
  isPublic: boolean;
  maxMembers: number;
  ownerId: number;
  owner?: User;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
  _count?: {
    members: number;
    expeditions: number;
  };
}

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  role: string;
  joinedAt: string;
  user?: User;
  team?: Team;
}

export interface Expedition {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  maxParticipants: number;
  cost?: number;
  isPremium: boolean;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;
  route?: Array<{
    lat: number;
    lng: number;
    name?: string;
  }>;
  creatorId: number;
  creator?: User;
  teamId?: number;
  team?: Team;
  createdAt: string;
  updatedAt: string;
  members?: ExpeditionMember[];
  _count?: {
    members: number;
  };
}

export interface ExpeditionMember {
  id: number;
  expeditionId: number;
  userId: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  joinedAt: string;
  user?: User;
  expedition?: Expedition;
}

export interface Message {
  id: number;
  content: string;
  authorId: number;
  author?: User;
  teamId?: number;
  expeditionId?: number;
  createdAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  type: 'premium' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
}

export interface SubscriptionPlan {
  name: string;
  price: number;
  duration: number;
  features: string[];
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