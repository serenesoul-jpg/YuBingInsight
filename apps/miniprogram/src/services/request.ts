import Taro from '@tarojs/taro'
import type { ApiResponse } from '@yubing/shared'
import { getToken } from '../stores/user'

export class RequestError extends Error {
  code: number

  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}

type RequestOptions = Taro.request.Option & { skipAuth?: boolean }

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const base = (API_BASE || '').replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export async function request<T>(options: RequestOptions): Promise<T> {
  const { skipAuth, ...rest } = options
  const token = getToken()
  const header: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rest.header as Record<string, string> | undefined),
  }

  if (token && !skipAuth) {
    header.Authorization = `Bearer ${token}`
  }

  const res = await Taro.request({
    ...rest,
    url: buildUrl(rest.url as string),
    header,
  })

  const body = res.data as ApiResponse<T>
  if (!body || typeof body.code !== 'number') {
    throw new RequestError('响应格式错误', -1)
  }
  if (body.code !== 0) {
    throw new RequestError(body.message || '请求失败', body.code)
  }
  return body.data
}

export function get<T>(url: string, data?: Record<string, unknown>) {
  return request<T>({ url, method: 'GET', data })
}

export function post<T>(url: string, data?: unknown, options?: { skipAuth?: boolean }) {
  return request<T>({ url, method: 'POST', data, skipAuth: options?.skipAuth })
}

export function patch<T>(url: string, data?: unknown) {
  return request<T>({ url, method: 'PATCH', data })
}
