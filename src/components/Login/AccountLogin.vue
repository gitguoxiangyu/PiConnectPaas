<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/utils/index'
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'
import type { LoginForm, picIfo } from '@/type/login'
import { getNumPiC } from '@/api/login'
const router = useRouter()
// 定义登录表单以及规则
const ruleFormRef = ref()
const loginForm = ref<LoginForm>({
  username: '',
  password: '',
  repassword: '',
  pic: ''
})
const loginRules = ref<FormRules<LoginForm>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,12}$/,
      message: '密码必须为6-12位',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== loginForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
})
/**
 * 登录表单提交
 */
const loginSubmit = async (): Promise<void> => {
  const [err] = await post('/captchaImage', {
    uuid: pic.value.uuid,
    codeOfUser: loginForm.value.pic
  })

  if (err === null) {
    await ruleFormRef.value.validate()
    const [, data] = await post('/user/login', {
      userName: loginForm.value.username,
      password: loginForm.value.password
    })
    if (data?.code === 400) {
      ElMessage.error('用户名或密码错误！')
    } else {
      ElMessage('登录成功')
      await router.push('/')
    }
  }
}
/**
 * 图形验证码
 */
const pic = ref<picIfo>({
  img: '',
  uuid: ''
})
// 获取验证码
const picGet = (): void => {
  getNumPiC()
    .then((data) => {
      pic.value.img = data?.img
      pic.value.uuid = data?.uuid
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}
onMounted(() => {
  picGet()
})
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="loginForm"
    :rules="loginRules"
    label-width="80px"
    style="margin-top: 5px"
    status-icon
  >
    <el-form-item
      label="用户名"
      prop="username"
    >
      <el-input
        v-model="loginForm.username"
        placeholder="请输入用户名："
      />
    </el-form-item>
    <el-form-item
      label="密码"
      prop="password"
    >
      <el-input
        v-model="loginForm.password"
        placeholder="请输入密码："
        type="password"
      />
    </el-form-item>
    <el-form-item
      label="确认密码"
      prop="repassword"
    >
      <el-input
        v-model="loginForm.repassword"
        type="password"
        placeholder="请确认密码："
      />
    </el-form-item>
    <el-form-item
      label="图形验证"
      prop="pic"
    >
      <el-input
        v-model="loginForm.pic"
        placeholder=""
        style="max-width: 100px"
      />
      <img
        :src="`data:image/png;base64,${pic.img}`"
        @click="picGet()"
      >
    </el-form-item>
    <div style="display: flex; justify-content: center; margin-top: 10%">
      <el-button
        style="width: 30%"
        @click="router.push('/login/regiester')"
      >
        注册
      </el-button>
      <el-button
        style="width: 30%"
        @click="loginSubmit"
      >
        登录
      </el-button>
    </div>
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
