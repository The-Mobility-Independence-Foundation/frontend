class BackendService {
  async get(endpoint: string, filters: string[] = [], sorts: string[] = []) {
    if (filters.length > 0) {
      endpoint += "?filters=" + filters.join(",");
    }

    if (sorts.length > 0) {
      endpoint += "&sorts=" + sorts.join(",");
    }

    return this.fetcher("GET", endpoint);
  }

  async post(endpoint: string, data: object) {
    return this.fetcher("POST", endpoint, data);
  }

  async patch(endpoint: string, data: object) {
    return this.fetcher("PATCH", endpoint, data);
  }

  async delete(endpoint: string) {
    return this.fetcher("DELETE", endpoint);
  }

  private async fetcher(method: string, endpoint: string, data: object | FormData | null = null) {
    const token = localStorage.getItem("token");

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token != null ? token : ""}`,
      "accept": "application/json",
    }

    if(!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
      method: method,
      body: data ? ((data instanceof FormData) ? data : JSON.stringify(data)) : null,
      headers: headers
    });

    if (!response.ok) {
      console.log(response.text);
    }

    return response.json();
  }
}

const backendService = new BackendService();
export default backendService;