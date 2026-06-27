<template>
  <div v-loading="loading">
    <div class="toolbar">
      <el-button type="primary" @click="exportData">导出 JSON</el-button>
    </div>
    <el-table :data="submissions" stripe>
      <el-table-column prop="template.title" label="问卷" min-width="160" />
      <el-table-column prop="template.scene" label="场景" width="100" />
      <el-table-column prop="anonymous" label="匿名" width="80">
        <template #default="{ row }">
          {{ row.anonymous ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="syncedAt" label="提交时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.syncedAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="答案摘要" min-width="200">
        <template #default="{ row }">
          {{ JSON.stringify(row.answers).slice(0, 80) }}…
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { API_ROUTES } from '@yubing/shared'
import { fetchApi } from '@/utils/api'

interface SubmissionRow {
  id: string
  anonymous: boolean
  answers: Record<string, unknown>
  syncedAt: string
  template: { title: string; scene: string }
}

const loading = ref(false)
const submissions = ref<SubmissionRow[]>([])

async function load() {
  loading.value = true
  try {
    submissions.value = await fetchApi<SubmissionRow[]>(
      `${API_ROUTES.admin.surveys}/submissions`,
    )
  } finally {
    loading.value = false
  }
}

async function exportData() {
  const data = await fetchApi<unknown[]>(API_ROUTES.admin.exportSurveys)
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `surveys-export-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('已导出')
}

onMounted(load)
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}
</style>
