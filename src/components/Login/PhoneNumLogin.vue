<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/utils/index'
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'
import type { PhoneNumForm } from '@/type/login'
import { submitPhoneNumber } from '@/api/login'
const router = useRouter()

/**
 * 手机登录
 */

const phoneNumFormRef = ref()

/** 发送验证码还需等待的时间 */
const codeSendTime = ref(0)

// 定义电话验证码表单
const phoneNumForm = ref<PhoneNumForm>({
  phoneNumber: null,
  code: '',
  tempKey: ''
})
// 定义校验规则
const phoneNumRules = ref<FormRules<PhoneNumForm>>({
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{10}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ]
})
/**
 * 提交手机号,发送验证码
 */
const subPhonenum = async (): Promise<void> => {
  await phoneNumFormRef.value.validate()
  ElMessage('发送成功')
  // 设置发送验证码的倒计时

  codeSendTime.value = 30

  const timeoutCtrl = setInterval(() => {
    if (codeSendTime.value === 0) {
      clearInterval(timeoutCtrl)
    }
    codeSendTime.value--
  }, 1000)
  // 获取临时密钥
  const [, data] = await post<string>('/user/sendCodeToPhone', {
    phoneNumber: phoneNumForm.value.phoneNumber
  })
  phoneNumForm.value.tempKey = data?.data
  console.log(phoneNumForm.value.tempKey)
}
/**
 * 提交手机号码和验证码
 */
const submitPhoneNum = async (): Promise<void> => {
  const data = await submitPhoneNumber(phoneNumForm.value)
  if (data === undefined) {
    ElMessage.error('验证码错误')
  } else {
    ElMessage('登录成功')
    await router.push('/')
  }
}
</script>

<template>
  <el-form
    ref="phoneNumFormRef"
    :model="phoneNumForm"
    :rules="phoneNumRules"
    label-width="80px"
    style="margin-top: 10%"
    status-icon
    class="phoneMenu"
  >
    <el-form-item
      label="手机号码"
      prop="phoneNumber"
    >
      <el-input
        v-model.number="phoneNumForm.phoneNumber"
        placeholder="请输入手机号码"
      />
    </el-form-item>
    <el-form-item
      label="验证码"
      prop="code"
    >
      <el-input
        v-model="phoneNumForm.code"
        style="max-width: 85px; margin-right: 5px"
      />
      <el-button
        :disabled="Boolean(codeSendTime)"
        @click="subPhonenum"
      >
        {{ codeSendTime ? `${codeSendTime}秒后重发` : '点击发送' }}
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        style="margin-left: -10px; width: 40%"
        @click="router.push('/login')"
      >
        返回
      </el-button>
      <el-button
        style="width: 45%"
        @click="submitPhoneNum"
      >
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
img {
  width: 50px;
  height: 30px;
  margin-left: 20px;
}
.changeBox {
  position: absolute;
  top: 88%;
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
.phoneMenu {
  .el-form-item {
    margin-bottom: 10%;
  }
}
</style>
