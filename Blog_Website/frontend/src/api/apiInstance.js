import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
  withCredentials: true,  // for sending cookies like refreshToken, accessToken
});

const blogAxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/blogs",
  withCredentials: true,  // for sending cookies like refreshToken, accessToken
});

export const registerUser = async (formData) => {
  try {
    const response = await axiosInstance.post("/register", formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await axiosInstance.post("/login", formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// ✅ Blog APIs (Clean Export)
export const getAllBlogs = async ({page,limit,theme}) => {
  try {
    const response = await blogAxiosInstance.get(`/all?page=${page}&limit=${limit}${theme ? `&theme=${theme}` : ''}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const postBlog = async (blogData) => {
  try {
    const response = await blogAxiosInstance.post("/post", blogData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getBlogById = async (blogId) => {
  try {
    const response = await blogAxiosInstance.get(`/${blogId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const searchBlogs = async ({query , page , limit}) => {
  try {
    const response = await blogAxiosInstance.get(`/search?query=${query}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const shareBlog = async (blogId) => {
  try {
    const response = await blogAxiosInstance.post(`/${blogId}/share`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await blogAxiosInstance.delete(`/${blogId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

export default {axiosInstance , blogAxiosInstance};
