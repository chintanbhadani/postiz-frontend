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

export const uploadsApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  listMedia: () => api.get("/uploads/media"),
};

export const integrationsApi = {
  platforms: () => api.get("/integrations/platforms"),
  list: () => api.get("/integrations"),
  getAuthUrl: (platform: string) => api.get(`/integrations/${platform}/auth-url`),
  connect: (data: any) => api.post("/integrations", data),
  disconnect: (id: string) => api.delete(`/integrations/${id}`),
  callback: (platform: string, code: string, state: string) =>
    api.get(`/integrations/${platform}/callback`, { params: { code, state } }),
  /** Instagram isBetweenSteps: fetch the list of pages after OAuth */
  instagramGetPages: (accessToken: string) =>
    api.get(`/integrations/instagram/pages`, { 
      params: { 
        accessToken,
        _t: Date.now() // Prevent aggressive browser caching (304 Not Modified)
      } 
    }),
  /** Instagram isBetweenSteps: save integration after user picks a page */
  instagramSelectPage: (data: { accessToken: string; pageId: string; igAccountId: string }) =>
    api.post("/integrations/instagram/select-page", data),
  /** Facebook isBetweenSteps: fetch the list of pages after OAuth */
  facebookGetPages: (accessToken: string) =>
    api.get(`/integrations/facebook/pages`, { 
      params: { 
        accessToken,
        _t: Date.now()
      } 
    }),
  /** Facebook isBetweenSteps: save integration after user picks a page */
  facebookSelectPage: (data: { accessToken: string; pageId: string }) =>
    api.post("/integrations/facebook/select-page", data),
  /** LinkedIn isBetweenSteps: fetch the list of pages/profiles after OAuth */
  linkedinGetPages: (accessToken: string) =>
    api.get(`/integrations/linkedin/pages`, { 
      params: { 
        accessToken,
        _t: Date.now()
      } 
    }),
  /** LinkedIn isBetweenSteps: save integration after user picks a page */
  linkedinSelectPage: (data: { accessToken: string; pageId: string }) =>
    api.post("/integrations/linkedin/select-page", data),
};

export const billingApi = {
  checkout: (successUrl: string, cancelUrl: string) =>
    api.post("/billing/checkout", { successUrl, cancelUrl }),
  portal: (returnUrl: string) =>
    api.post("/billing/portal", { returnUrl }),
  invoices: () =>
    api.get("/billing/invoices"),
};

export default api;