import axios from "axios";
import { LoginSchema } from "./auth-schema";
import { CreatePostSchema } from "./post-schema";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000 * 5,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = localStorage.getItem("accessToken");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const registerUser = async ({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
      confirmPassword,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async ({ email, password }: LoginSchema) => {
  try {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiClient.get("/auth/logout");
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchPosts = async ({ params }: { params?: URLSearchParams }) => {
  try {
    const response = await apiClient.get(`/posts?${params}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchPostById = async (postId: string) => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);

    return response;
  } catch (error) {
    throw error;
  }
};

export const createNewPost = async (postData: CreatePostSchema) => {
  try {
    const response = await apiClient.post("/posts", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (
  postId: string,
  postData: CreatePostSchema
) => {
  try {
    const response = await apiClient.put(`/posts/${postId}`, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchPostsByUser = async () => {
  try {
    const response = await apiClient.get("/users/posts");
    return response;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
