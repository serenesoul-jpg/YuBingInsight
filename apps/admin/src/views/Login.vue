<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <div class="brand">
        <img src="/logo/full.png" alt="语冰" class="brand-logo" />
        <p class="subtitle">YuBing Insight · 管理后台</p>
      </div>
      <el-form :model="form" @submit.prevent="onSubmit">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="admin" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="默认 yubing2026"
            show-password
          />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading" block>
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const form = reactive({ username: 'admin', password: 'yubing2026' })

async function onSubmit() {
  loading.value = true
  try {
    await auth.login(form.username, form.password)
    ElMessage.success('登录成功')
    router.replace('/')
  } catch (e) {
    ElMessage.error((e as Error).message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0f;
}

.login-card {
  width: 420px;
  padding: 8px;
}

.brand {
  text-align: center;
  margin-bottom: 24px;
}

.brand-logo {
  width: 240px;
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto 12px;
}

.subtitle {
  color: #888;
  margin: 0;
  font-size: 14px;
}
</style>
