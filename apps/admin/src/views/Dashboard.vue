<template>
  <div class="dashboard" v-loading="loading">
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">用户总数</div>
          <div class="stat-value">{{ data?.userCount ?? '—' }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">近 7 日问卷</div>
          <div class="stat-value">{{ data?.recentSubmissions ?? '—' }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">课程数</div>
          <div class="stat-value">{{ data?.courseCount ?? '—' }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">关怀模式占比</div>
          <div class="stat-value">
            {{ careRatio }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="kpi-card" shadow="never">
      <template #header>成果 KPI（可配置）</template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="教学课时">
          {{ data?.stats?.courseHours ?? 200 }}+
        </el-descriptions-item>
        <el-descriptions-item label="媒体报道">
          {{ data?.stats?.mediaReports ?? 14 }} 家
        </el-descriptions-item>
        <el-descriptions-item label="调研站点">
          {{ data?.stats?.siteCount ?? 6 }} 地
        </el-descriptions-item>
        <el-descriptions-item label="问卷回收">
          {{ data?.stats?.surveyCount ?? 0 }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DashboardDto } from '@yubing/shared'
import { API_ROUTES } from '@yubing/shared'
import { fetchApi } from '@/utils/api'

const loading = ref(true)
const data = ref<DashboardDto | null>(null)

const careRatio = computed(() => {
  const ratio = data.value?.stats?.careModeRatio ?? 0
  return `${(ratio * 100).toFixed(1)}%`
})

onMounted(async () => {
  try {
    data.value = await fetchApi<DashboardDto>(API_ROUTES.admin.dashboard)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.stat-label {
  font-size: 14px;
  color: #888;
}
.stat-value {
  font-size: 28px;
  font-weight: 600;
  margin-top: 8px;
  color: #004ea2;
}
.kpi-card {
  margin-top: 16px;
}
</style>
