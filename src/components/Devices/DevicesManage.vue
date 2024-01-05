<template>
  <div class="main">
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="ID">
        <el-input
          v-model="formInline.user"
          placeholder="Approved by"
          clearable
        />
      </el-form-item>
      <el-form-item label="设备名称">
        <el-select
          v-model="formInline.region"
          placeholder="Activity zone"
          clearable
        >
          <el-option
            label="Zone one"
            value="shanghai"
          />
          <el-option
            label="Zone two"
            value="beijing"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间">
        <el-date-picker
          v-model="formInline.date"
          type="date"
          placeholder="Pick a date"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-4">
      <el-button type="primary">
        新增
      </el-button>
      <el-button type="danger">
        删除
      </el-button>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="id"
        label="id"
        width="150"
      />
      <el-table-column
        prop="device_name"
        label="device_name"
        width="300"
      />
      <el-table-column
        prop="system"
        label="system"
        width="300"
      />
      <el-table-column
        prop="login_time"
        label="login_time"
        width="300"
      />
      <el-table-column
        prop="status"
        label="status"
        width="200"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
      >
        <template #default>
          <el-button
            link
            type="primary"
            size="small"
            @click="dialogTable = true"
          >
            设置回调
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="dialogTable = true"
          >
            重启
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="dialogTable = true"
          >
            下线
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogTable"
      title="自定义事件触发器"
    >
      <el-form
        :model="form"
        label-width="120px"
      >
        <el-form-item label="事件名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="触发行为">
          <el-select
            v-model="form.action"
            placeholder="触发行为"
          >
            <el-option value="温度阈值" />
            <el-option value="湿度阈值" />
            <el-option value="设备离线" />
          </el-select>
        </el-form-item>
        <el-form-item label="阈值">
          <el-input v-model="form.outvalue" />
        </el-form-item>
        <el-form-item label="回调url">
          <el-input v-model="form.url" />
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button
          type="primary"
          @click="handle"
        >
          提交
        </el-button>
      </el-form-item>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { h, reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
import tableData from './devices.json'
const dialogTable = ref(false)
const form = ref({
  name: '',
  action: '',
  outvalue: '',
  url: ''
})
const handle = (): void => {
  setTimeout(() => {
    dialogTable.value = false
    ElNotification({
      title: '提示',
      message: h('i', { style: 'color: teal' }, '添加成功')
    })
  }, 500)
}

const formInline = reactive({
  user: '',
  region: '',
  date: ''
})

const onSubmit = () => {
  console.log('submit!')
}
// const tableData = [
//   {
//     date: '2016-05-03',
//     name: 'Tom',
//     state: 'California',
//     city: 'Los Angeles',
//     address: 'No. 189, Grove St, Los Angeles',
//     zip: 'CA 90036',
//     tag: 'Home'
//   },
//   {
//     date: '2016-05-02',
//     name: 'Tom',
//     state: 'California',
//     city: 'Los Angeles',
//     address: 'No. 189, Grove St, Los Angeles',
//     zip: 'CA 90036',
//     tag: 'Office'
//   },
//   {
//     date: '2016-05-04',
//     name: 'Tom',
//     state: 'California',
//     city: 'Los Angeles',
//     address: 'No. 189, Grove St, Los Angeles',
//     zip: 'CA 90036',
//     tag: 'Home'
//   },
//   {
//     date: '2016-05-01',
//     name: 'Tom',
//     state: 'California',
//     city: 'Los Angeles',
//     address: 'No. 189, Grove St, Los Angeles',
//     zip: 'CA 90036',
//     tag: 'Office'
//   }
// ]
</script>

<style scoped>
.main{
  background-color: white;
}
</style>
