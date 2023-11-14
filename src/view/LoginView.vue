<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type FcResponse, get, post } from '@/utils/index'
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'

const loginIng = ref(0)
// 电话denglu
interface PhoneNumForm {
  phoneNumber: number
  code?: string
  tempKey?: string
  data?: string
}
const phoneNumForm = ref<PhoneNumForm>({
  phoneNumber: 0,
  code: '',
  tempKey: ''
})
const phoneNumRules = ref<FormRules<PhoneNumForm>>({
  phoneNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
})
const subPhonenum = async () => {
  const phoneNumObject = {
    phoneNumber: phoneNumForm.value.phoneNumber
  }

  const [err, data] = await post<string>('/user/sendCodeToPhone', phoneNumObject)
  if (err === null) {
    ElMessage.error('网络繁忙')
    console.log(err)
  } else {
    console.log(data?.data)
    phoneNumForm.value.tempKey = data?.data
  }
}
const submitPhoneNum = async () => {
  console.log(phoneNumForm.value)

  const [err, data] = await post<PhoneNumForm>('/user/verifyCode', phoneNumForm.value)
  if (err)
    ElMessage.error('服务器繁忙')
  else
    console.log(data)
}
// 微信登录相关
const wechatloginable = ref(false)
const QRcodeready = ref(false)
interface wechatQRCode {
  qrUrl?: string
  tempUserId?: string
}
const wechatLoginInfo = ref<wechatQRCode>({
  qrUrl: '',
  tempUserId: ''
})
const getQRcod = async (): Promise<FcResponse<wechatQRCode> | undefined> => {
  try {
    const [err, data] = await get<wechatQRCode>('/wxUser/wxQr')
    if (err) {
      console.error(err)
      return undefined
    } else return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
const getResponse = async (): Promise<void> => {
  // const lock = setInterval(async (): Promise<void> => {
  //   const [err, data] = await get(
  //     `/wxUser/isLogin?tempUserId=${wechatLoginInfo.value.tempUserId}`
  //   )
  // }, 1000)
  // setTimeout(() => {
  //   clearInterval(lock)
  // }, 30000)
  const [err, data] = await get(
      `/wxUser/isLogin?tempUserId=${wechatLoginInfo.value.tempUserId}`
  )
  
  setTimeout(async () => {
    await getResponse()
    return void
  }, 1000)
}
const wechatlogin = async (): Promise<void> => {
  wechatloginable.value = true
  try {
    const data = await getQRcod()
    wechatLoginInfo.value.qrUrl = data?.data.qrUrl
    wechatLoginInfo.value.tempUserId = data?.data.tempUserId
    setTimeout(() => {
      QRcodeready.value = true
      getResponse()
    }, 1000)
  } catch (error) {
    console.error(error)
  }
  console.log(wechatLoginInfo.value)
}
// 定义登录表单以及规则
interface LoginForm {
  username?: string
  password?: string
  repassword?: string
  pic?: string
}
const loginForm = ref<LoginForm>({
  username: '',
  password: '',
  repassword: '',
  pic: ''
})
const confirmpwd = (rule: any, value: any, callback: any): void => {
  if (value === '') callback(new Error('请再次输入密码'))
  else if (value !== loginForm.value.password)
    callback(new Error('两次输入不匹配'))
  else console.log(rule)
}
const loginRules = ref<FormRules<LoginForm>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 5, message: '密码位数', trigger: 'blur' }
  ],
  repassword: [
    { validator: confirmpwd, trigger: 'blur' },
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})
// 定义注册表单及其相应规则
interface SigninForm {
  phoneNumber: string
  password: string
  nickName: string
  gender: '女' | '男'
  age: number
}
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
    { min: 11, max: 11, message: '手机号位数', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, max: 10, message: '密码为4-10位', trigger: 'blur' }
  ],
  nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
})
interface signinReturn {
  userId: number
  userName: string
  nickName: string
  gender: '男' | '女'
  phoneNumber: string
  avatarUrl: null
  token: string
  age: number
  registerDays: null
}
const signinSubmit = async (): Promise<void> => {
  try {
    const [err, data] = await post<signinReturn>(
      '/user/register',
      signinForm.value
    )
    if (err) console.error(err)
    else {
      console.log(data)
      ElMessage('创建成功')
      loginIng.value = 0
    }
  } catch (error) {
    console.error(error)
  }
}
// 验证码
const pic = ref<picIfo>({
  img: '',
  uuid: ''
})
interface picIfo {
  img?: string
  captchaEnabled?: boolean
  uuid?: string
}
const getNumPiC = async (): Promise<void> => {
  try {
    const [err, data] = await get<picIfo>('/captchaImage')
    if (err) console.error(err)
    else {
      pic.value.img = data?.data.img
      pic.value.uuid = data?.data.uuid
      console.log(pic.value.img)
    }
  } catch (error) {
    console.error(error)
  }
}
// const  = async () => {
//   const [err, data] = await get("/captchaImage");
//   console.log(data);
// };
onMounted(() => {
  void getNumPiC()
})
</script>

<template>
  <div class="loginPage">
    <el-row class="loginview">
      <el-col :span="12" class="bg"></el-col>
      <el-col :span="12" class="formView">
        <h3>PiConnect</h3>
        <el-form
          v-if="loginIng==0"
          ref="ruleFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-width="80px"
          style="margin-top: 5px"
          status-icon
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名："
            />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            style="margin-bottom: 12px"
          >
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码："
              type="password"
            />
            <el-button link style="color: #999; font-size: 0.8em"
              >忘记密码？</el-button
            >
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword" type="password">
            <el-input
              v-model="loginForm.repassword"
              placeholder="请确认密码："
            />
          </el-form-item>
          <el-form-item label="图形验证" prop="pic">
            <el-input
              v-model="loginForm.pic"
              placeholder=""
              style="max-width: 100px"
            />
            <img :src="`data:image/png;base64,${pic.img}`" @click="getNumPiC">
          </el-form-item>
          <div style="display: flex; justify-content: center; margin-top: 15%">
            <el-button style="width: 30%" @click="loginIng=1">注册</el-button>
            <el-button style="width: 30%">登录</el-button>
          </div>
        </el-form>
        <el-form
          v-if="loginIng==1"
          ref="signinFormRef"
          :model="signinForm"
          :rules="signinRules"
          label-width="80px"
          style="margin-top: 10px"
          status-icon
        >
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input
              v-model.number="signinForm.phoneNumber"
              placeholder="请输入手机号码"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="signinForm.password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="signinForm.nickName" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="signinForm.gender">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="signinForm.age" :min="1" :max="120" />
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left: -10px; width: 40%"
              @click="loginIng = 0"
              >去登录</el-button
            >
            <el-button @click="signinSubmit" style="width: 45%"
              >立即注册</el-button
            >
          </el-form-item>
        </el-form>
        <el-form v-if="loginIng==2"
          ref="signinFormRef"
          :model="phoneNumForm"
          :rules="phoneNumRules"
          label-width="80px"
          style="margin-top: 10px"
          status-icon
          >
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input v-model.number="phoneNumForm.phoneNumber" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="phoneNumForm.code" placeholder="请输入验证码" />
            <el-button @click="subPhonenum">点击发送</el-button>
          </el-form-item>
          <el-button>返回</el-button>
          <el-button @click="submitPhoneNum">登录</el-button>
        </el-form>
        <div class="changeBox">
          <div
            style="
              display: flex;
              justify-content: center;
              font-size: small;
              color: #777;
            "
          >
            或者尝试：
          </div>
          <img
            src="@/assets/phone.png"
            alt=""
            style="width: 20px; height: 20px; vertical-align: middle"
          />
          <el-button link style="height: 100%" @click="loginIng=2">手机登录</el-button
          ><span>or</span
          ><el-button link @click="wechatlogin">扫码登录</el-button>
          <img
            src="@/assets/wechat.png"
            alt=""
            style="
              width: 20px;
              height: 20px;
              margin-left: 5px;
              vertical-align: middle;
            "
          />
        </div>
      </el-col>
    </el-row>
  </div>
  <el-dialog v-model="wechatloginable" title="扫码登陆" width="350px" draggable>
    <div></div>
    <template #footer>
      <img
        v-if="QRcodeready"
        :src="wechatLoginInfo.qrUrl"
        alt=""
        style="width: 200px; height: 200px; margin-bottom: 50px"
      />
      <img
        v-if="!QRcodeready"
        src="@/assets/loading.png"
        alt=""
        style="width: 200px; height: 200px; margin-bottom: 50px"
      />

      <span class="dialog-footer">
        <el-button @click="wechatloginable = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.loginPage {
  height: 100vh;
  overflow: hidden;
  background-color: rgb(245, 247, 250);
  display: flex;
  justify-content: center;
  align-items: center;
  .loginview {
    background-color: #fff;
    width: 45%;
    height: 45%;
    min-height: 200px;
    min-width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    .bg {
      background: url("../assets/loginlogo.JPG") no-repeat 100% center; //图片靠右对齐
      background-size: cover;
      height: 100%;
    }
    .formView {
      display: flex;
      flex-direction: column;
      // justify-content:space-between;
      align-items: center;
      background: linear-gradient(to right, #f0f0f0, #ececec);
      height: 100%;
      img {
        width: 50px;
        height: 30px;
        margin-left: 20px;
      }
      .changeBox {
        position: absolute;
        bottom: 2%;
      }
      .el-input {
        width: 90%;
      }
      .el-input-number {
        width: 90%;
      }
    }
  }
}
</style>
