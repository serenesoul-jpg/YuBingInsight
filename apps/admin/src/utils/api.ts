import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  },
)

export async function fetchApi<T>(url: string, config?: Parameters<typeof api.get>[1]) {
  const res = await api.get<{ data: T }>(url, config)
  return res.data.data
}

export async function postApi<T>(url: string, body?: unknown) {
  const res = await api.post<{ data: T }>(url, body)
  return res.data.data
}
