class BackendService {
  async get(endpoint: string, filters: string[] = [], sorts: string[] = []) {
    if (filters) {
      endpoint += "?filters=" + filters.join(",");
    }

    if (sorts) {
      endpoint += "&sorts=" + sorts.join(",");
    }

    return this.fetcher("GET", endpoint);
  }

  async post(endpoint: string, data: object) {
    return this.fetcher("POST", endpoint, data);
  }

  async put(endpoint: string, data: object) {
    return this.fetcher("PUT", endpoint, data);
  }

  async delete(endpoint: string) {
    return this.fetcher("DELETE", endpoint);
  }

  private async fetcher(method: string, endpoint: string, data: object | null = null) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`, {
      method: method,
      body: data ? JSON.stringify(data) : null,
      headers: {
        "X-Api-Key": token != null ? token : ""
      }
    });

    if (!response.ok) {
      console.log(response.text);
    }

    return response.json();
  }
}

const backendService = new BackendService();
export default backendService;