<template>
  <el-table :data="users" v-loading="loading" stripe>
    <el-table-column prop="nickname" label="昵称" />
    <el-table-column prop="role" label="角色" width="120" />
    <el-table-column prop="careMode" label="关怀模式" width="100">
      <template #default="{ row }">{{ row.careMode ? '是' : '否' }}</template>
    </el-table-column>
    <el-table-column prop="region" label="地区" />
    <el-table-column prop="school" label="学校" />
    <el-table-column prop="createdAt" label="注册时间" width="180">
      <template #default="{ row }">
        {{ new Date(row.createdAt).toLocaleString() }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API_ROUTES, USER_ROLE_LABELS } from '@yubing/shared'
import { fetchApi } from '@/utils/api'

interface UserRow {
  id: string
  nickname: string | null
  role: string
  careMode: boolean
  region: string | null
  school: string | null
  createdAt: string
}

const loading = ref(false)
const users = ref<UserRow[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const rows = await fetchApi<UserRow[]>(API_ROUTES.admin.users)
    users.value = rows.map((u) => ({
      ...u,
      role: USER_ROLE_LABELS[u.role as keyof typeof USER_ROLE_LABELS] || u.role,
    }))
  } finally {
    loading.value = false
  }
})
</script>
