import axios from "axios";

export interface Course {
  course_id: string;
  title: string;
  instructor: string;
  category: string;
  duration: string;
}

const API_URL = process.env.NEXT_PUBLIC_COURSE_URL || "http://localhost:7002/api/courses";

export const fetchCourses = async (token: string): Promise<Course[]> => {
  const res = await axios.get(`${API_URL}/search?q=`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const searchCourses = async (query: string, token: string): Promise<Course[]> => {
  const res = await axios.get(`${API_URL}/search?q=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export interface UploadResponse {
  success: boolean;
  message: string;
  count?: number;
  error?: string;
  details?: any;
  failedRows?: Array<{
    row: number;
    error: string;
    data: any;
  }>;
  validRows?: number;
  invalidRows?: number;
}

export const uploadCourses = async (
  file: File,
  token: string,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<UploadResponse>(
      `${API_URL}/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        message: error.response.data.error || 'Upload failed',
        error: error.response.data.message,
        ...error.response.data,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        message: 'No response from server',
        error: 'Network error',
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        message: 'Error setting up request',
        error: error.message,
      };
    }
  }
};


