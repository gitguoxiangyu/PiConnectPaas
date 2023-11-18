<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'
import type { SigninForm } from '@/type/login'
import { checkPhoneNum } from '@/api/login'
const router = useRouter()

// 定义注册表单及其相应规则
const signinFormRef = ref()
const signinForm = ref<SigninForm>({
  phoneNumber: '',
  password: '',
  nickName: '',
  gender: '男',
  age: 0
})
const signinRules = ref<FormRules<SigninForm>>({
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{10}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,12}$/,
      message: '密码必须为6-12位',
      trigger: 'blur'
    }
  ],
  nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
})
/**
 * 注册表单提交
 */
const signinSubmit = async (): Promise<void> => {
  await signinFormRef.value.validate()
  const data = await checkPhoneNum(signinForm.value)
  if (data === undefined) {
    ElMessage.error('该手机号已被注册！')
  } else {
    ElMessage('注册成功')
    await router.push('/login')
    signinForm.value = {
      phoneNumber: '',
      password: '',
      nickName: '',
      gender: '男',
      age: 0
    }
  }
}
</script>

<template>
  <el-form
    ref="signinFormRef"
    :model="signinForm"
    :rules="signinRules"
    label-width="80px"
    status-icon
    class="loginMenu"
  >
    <el-form-item
      label="手机号码"
      prop="phoneNumber"
    >
      <el-input
        v-model.number="signinForm.phoneNumber"
        placeholder="请输入手机号码"
      />
    </el-form-item>
    <el-form-item
      label="密码"
      prop="password"
    >
      <el-input
        v-model="signinForm.password"
        placeholder="请输入密码"
      />
    </el-form-item>
    <el-form-item
      label="昵称"
      prop="nickName"
    >
      <el-input
        v-model="signinForm.nickName"
        placeholder="请输入昵称"
      />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="signinForm.gender">
        <el-radio label="男" />
        <el-radio label="女" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="年龄">
      <el-input-number
        v-model="signinForm.age"
        :min="1"
        :max="120"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        style="margin-left: -10px; width: 40%"
        @click="router.push('/login')"
      >
        去登录
      </el-button>
      <el-button
        style="width: 45%"
        @click="signinSubmit"
      >
        立即注册
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
img {
  width: 50px;
  height: 30px;
  margin-left: 20px;
}
.el-form-item {
  margin-bottom: 10%;
}
@media screen and (max-height: 800px) {
  .el-form-item {
    margin-bottom: 4%;
  }
}
.el-input {
  width: 90%;
}
.el-input-number {
  width: 90%;
}
</style>
