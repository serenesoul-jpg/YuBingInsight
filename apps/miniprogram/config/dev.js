// 联调远程 API：设置环境变量 YUBING_API_BASE（勿提交 IP 到 Git）
// PowerShell: $env:YUBING_API_BASE="http://8.130.52.140:3000"; pnpm dev:mp
const apiBase = process.env.YUBING_API_BASE || 'http://localhost:3000'

module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {
    API_BASE: JSON.stringify(apiBase),
  },
  mini: {},
  h5: {},
}
