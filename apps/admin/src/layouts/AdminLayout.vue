<template>
  <el-container class="admin-layout">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <img src="/logo/full.png" alt="语冰" class="logo-img" />
        <span class="logo-sub">管理后台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#0a0a0f"
        text-color="#ffffff"
        active-text-color="#F5A623"
      >
        <el-menu-item index="/">
          <el-icon><Odometer /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/courses">
          <el-icon><Reading /></el-icon>
          <span>课程管理</span>
        </el-menu-item>
        <el-menu-item index="/surveys">
          <el-icon><Document /></el-icon>
          <span>问卷数据</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <h1>{{ pageTitle }}</h1>
        <el-button type="danger" link @click="onLogout">退出</el-button>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Odometer, Reading, Document, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const activeMenu = computed(() => route.path)
const pageTitle = computed(() => (route.meta.title as string) || '语冰管理后台')

function onLogout() {
  auth.logout()
  router.replace('/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.aside {
  background-color: #0a0a0f;
}

.logo {
  padding: 16px 12px 20px;
  text-align: center;
}

.logo-img {
  width: 100%;
  max-width: 180px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.logo-sub {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 8px;
}

.header {
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.main {
  background: #f6f8fa;
}
</style>
