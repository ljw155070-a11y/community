const BASE = import.meta.env.VITE_BACK_SERVER;

async function request(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // 나중에 권한 붙이면 여기 Authorization 추가
    // headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${text}`);
  }
  return await res.json();
}

export const adminApi = {
  dashboard: () => request(`/api/admin/dashboard`),

  members: ({ q = "", status = "ALL", page = 1, size = 10 }) =>
    request(
      `/api/admin/members?q=${encodeURIComponent(
        q
      )}&status=${status}&page=${page}&size=${size}`
    ),

  posts: ({ q = "", categoryId = "ALL", page = 1, size = 10 }) =>
    request(
      `/api/admin/posts?q=${encodeURIComponent(
        q
      )}&categoryId=${categoryId}&page=${page}&size=${size}`
    ),

  reports: ({ status = "ALL", page = 1, size = 10 }) =>
    request(`/api/admin/reports?status=${status}&page=${page}&size=${size}`),

  settings: () => request(`/api/admin/settings`),
};
