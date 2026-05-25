import dataService from "../app/axios/dataService";

const api = dataService;

export const authApi = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export const postsApi = {
  create: (data: any) => api.post("/posts", data),
  list: (params?: any) => api.get("/posts", { params }),
  get: (id: string) => api.get(`/posts/${id}`),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
};

export const integrationsApi = {
  platforms: () => api.get("/integrations/platforms"),
  list: () => api.get("/integrations"),
  getAuthUrl: (platform: string) => api.get(`/integrations/${platform}/auth-url`),
  connect: (data: any) => api.post("/integrations", data),
  disconnect: (id: string) => api.delete(`/integrations/${id}`),
  /** Instagram isBetweenSteps: fetch the list of pages after OAuth */
  instagramGetPages: (accessToken: string) =>
    api.get("/integrations/instagram/pages", { params: { accessToken } }),
  /** Instagram isBetweenSteps: save integration after user picks a page */
  instagramSelectPage: (data: { accessToken: string; pageId: string; igAccountId: string }) =>
    api.post("/integrations/instagram/select-page", data),
};

export default api;