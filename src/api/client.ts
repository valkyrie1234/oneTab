/**
 * API клиент для работы с бэкендом
 */

const API_URL = "http://localhost:3005";

export class APIClient {
  /**
   * Базовый fetch с автоматической обработкой токенов
   */
  static async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const accessToken = localStorage.getItem("accessToken");

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    };

    let response = await fetch(`${API_URL}${endpoint}`, config);

    // Если 401 - пробуем обновить токены
    if (response.status === 401 && accessToken) {
      const refreshed = await this.refreshTokens();

      if (refreshed) {
        // Повторяем запрос с новым токеном
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${refreshed.accessToken}`,
        };
        response = await fetch(`${API_URL}${endpoint}`, config);
      }
    }

    return response;
  }

  /**
   * GET запрос
   */
  static async get(endpoint: string): Promise<unknown> {
    const response = await this.request(endpoint);
    return response.json();
  }

  /**
   * POST запрос
   */
  static async post(endpoint: string, data?: unknown): Promise<unknown> {
    const response = await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * PATCH запрос
   */
  static async patch(endpoint: string, data?: unknown): Promise<unknown> {
    const response = await this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * DELETE запрос
   */
  static async delete(endpoint: string): Promise<unknown> {
    const response = await this.request(endpoint, {
      method: "DELETE",
    });
    return response.json();
  }

  /**
   * Обновление токенов
   */
  static async refreshTokens(): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) return null;

      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("accessToken", data.data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
        return data.data.tokens;
      }

      return null;
    } catch (error) {
      console.error("Ошибка обновления токенов:", error);
      return null;
    }
  }
}

/**
 * Auth API
 */
export const AuthAPI = {
  async register(username: string, email: string, password: string) {
    return APIClient.post("/api/auth/register", { username, email, password });
  },

  async login(email: string, password: string) {
    return APIClient.post("/api/auth/login", { email, password });
  },

  async logout() {
    return APIClient.post("/api/auth/logout");
  },

  async me() {
    return APIClient.get("/api/auth/me");
  },
};

/**
 * Boards API
 */
export const BoardsAPI = {
  async getAll(userId?: string, systemOnly?: boolean) {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (systemOnly) params.append("systemOnly", "true");
    return APIClient.get(`/api/boards?${params.toString()}`);
  },

  async getById(id: string) {
    return APIClient.get(`/api/boards/${id}`);
  },

  async create(data: unknown) {
    return APIClient.post("/api/boards", data);
  },
};

/**
 * Tasks API
 */
export const TasksAPI = {
  async getUserTasks(userId: string) {
    return APIClient.get(`/api/tasks?userId=${userId}`);
  },

  async getById(id: string) {
    return APIClient.get(`/api/tasks/${id}`);
  },

  async create(data: unknown) {
    return APIClient.post("/api/tasks", data);
  },

  async update(id: string, data: unknown) {
    return APIClient.patch(`/api/tasks/${id}`, data);
  },

  async complete(id: string) {
    return APIClient.post(`/api/tasks/${id}/complete`);
  },

  async delete(id: string) {
    return APIClient.delete(`/api/tasks/${id}`);
  },
};

