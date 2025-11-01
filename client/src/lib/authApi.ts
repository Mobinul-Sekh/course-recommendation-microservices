import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:7001/api/auth";

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

export const loginAdmin = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await axios.post<AuthResponse>(
      `${API_URL}/login`, 
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log(res.data);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data?.message || 'Login failed. Please try again.');
  }
};

export const signupAdmin = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await axios.post<AuthResponse>(
      `${API_URL}/signup`, 
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data?.message || 'Signup failed. Please try again.');
  }
};

