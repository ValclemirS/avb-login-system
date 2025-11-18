export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<User, 'password'>;
}

export interface DashboardStats {
  totalUsers: number;
  lastUser: {
    name: string;
    email: string;
    createdAt: string;
  } | null;
  monthlyRegistrations: Array<{
    month: string;
    usuarios: number;
  }>;
}