import axios from "axios";

// baseURL을 "/api"로 두면 요청이 http://localhost:5173/api/... 로 나감
// vite 프록시가 8080으로 넘겨주기 때문에 브라우저 입장에선 같은 출처라 CORS가 발생하지 않음
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// 요청마다 저장된 JWT를 Authorization 헤더에 붙인다.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 토큰이 만료시 401 발생후 로그인 화면으로 이동. (로그인 요청 자체의 401은 제외)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/users/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("loginId");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
