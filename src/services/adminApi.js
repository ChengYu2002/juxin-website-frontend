// src/services/adminApi.js
import { getAdminToken } from '../admin/auth.js'

// 在每个 admin 请求里，自动把 token 放进 HTTP header，交给后端处理认证
export async function adminFetch(url, options = {}) {
  const token = getAdminToken()

  /*
  参数：
    url：请求地址，比如 '/api/admin/products'
    options：fetch 的配置对象（method、headers、body 等）
    - options = {} 表示：调用方不传 options 也不会报错。

  整体作用：
    用 fetch 向 url 发请求，请求配置在 options 的基础上，
    额外统一加上 JSON 头和 admin token（如果有），然后等服务器回我一个响应
  */

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }), // 如果 token 存在，就把 Authorization header 加进去
      ...options.headers, // 调用方传的 headers 会覆盖前面的 headers
    },
  })

  const data = await res.json().catch(() => ({}))
  /*
  尝试把响应 body 解析为 JSON，并赋值给 data。
    .catch(() => ({})) 是为了容错：
    如果后端没返回 JSON（比如空 body / HTML 错误页 / 纯文本），res.json() 会抛异常
    这里就吞掉异常并返回空对象 {}，避免整个函数因为解析失败直接崩掉
  */

  if (!res.ok) {
    const err = new Error(
      (data && data.error) ||
        (data && data.message) ||
        (typeof data === 'string' && data) ||
        res.statusText ||
        'Request failed'
    )
    err.status = res.status
    err.data = data
    throw err
  }


  return data
}
