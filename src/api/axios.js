// src/api/axios.js
import axios from "axios";
import { ElMessage } from "element-plus";

// 创建 Axios 实例
const api = axios.create({
  baseURL: "http://localhost:8082                                 ", // 设置后端基础 URL
  timeout: 5000, // 设置超时时间（单位：毫秒）
});

// 请求拦截器（可选，适用于需要处理 token 的项目）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 假设登录后存储 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器（统一处理错误消息）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    ElMessage.error(error.response?.data?.message || "请求错误，请稍后再试");
    return Promise.reject(error);
  },
);

export default api;
