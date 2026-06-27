<template>
  <div v-loading="loading">
    <div class="toolbar">
      <el-button type="primary" @click="openCreate">新建课程</el-button>
    </div>
    <el-table :data="courses" stripe>
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="published" label="上架" width="80">
        <template #default="{ row }">
          <el-tag :type="row.published ? 'success' : 'info'">
            {{ row.published ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="课时" width="80">
        <template #default="{ row }">{{ row.units?.length ?? 0 }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button link type="primary" @click="togglePublish(row)">
            {{ row.published ? '下架' : '上架' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="新建课程" width="480px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category">
            <el-option
              v-for="c in COURSE_CATEGORIES"
              :key="c.key"
              :label="c.label"
              :value="c.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createCourse">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { API_ROUTES, COURSE_CATEGORIES } from '@yubing/shared'
import { api, fetchApi, postApi } from '@/utils/api'

interface CourseRow {
  id: string
  title: string
  category: string
  description?: string
  published: boolean
  units?: unknown[]
}

const loading = ref(false)
const courses = ref<CourseRow[]>([])
const dialogVisible = ref(false)
const form = reactive({
  title: '',
  category: 'puzzle',
  description: '',
})

async function load() {
  loading.value = true
  try {
    courses.value = await fetchApi<CourseRow[]>(API_ROUTES.admin.courses)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  dialogVisible.value = true
}

async function createCourse() {
  await postApi(API_ROUTES.admin.courses, {
    ...form,
    published: true,
  })
  ElMessage.success('已创建')
  dialogVisible.value = false
  await load()
}

async function togglePublish(row: CourseRow) {
  await api.patch(`${API_ROUTES.admin.courses}/${row.id}`, {
    published: !row.published,
  })
  ElMessage.success('已更新')
  await load()
}

onMounted(load)
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}
</style>
