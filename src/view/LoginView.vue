<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/utils/index'
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'
import type { PhoneNumForm, LoginForm, SigninForm, picIfo, wechatQRCode } from '@/type/login'
import { checkPhoneNum, getNumPiC, getQRcod, submitPhoneNumber } from '@/api/login'
const loginIng = ref(0)
const router = useRouter()
// 电话登录
const phoneNumFormRef = ref()
const sendCodeCtrl = ref('点击发送')
const enableSendCode = ref(false)
const phoneNumForm = ref<PhoneNumForm>({
  phoneNumber: null,
  code: '',
  tempKey: ''
})
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

/** 获取验证码回调 */
const subPhonenum = async (): Promise<void> => {
  await phoneNumFormRef.value.validate()
  let timeout = 30
  const timeoutCtrl = setInterval(() => {
    enableSendCode.value = true
    sendCodeCtrl.value = `${timeout}秒后重发`
    if (timeout === 0) {
      enableSendCode.value = false
      sendCodeCtrl.value = '点击发送'
      clearInterval(timeoutCtrl)
    }
    timeout--
  }, 1000)
  const [, data] = await post<string>('/user/sendCodeToPhone', { phoneNumber: phoneNumForm.value.phoneNumber })
  phoneNumForm.value.tempKey = data?.data
}
const submitPhoneNum = async (): Promise<void> => {
  const data = await submitPhoneNumber(phoneNumForm.value)
  if (data === undefined) {
    ElMessage.error('验证码错误')
  } else {
    console.log(data)
  }
}
// 微信登录相关
const wechatloginable = ref(false)
const QRcodeready = ref(false)
const wechatLoginInfo = ref<wechatQRCode>({
  qrUrl: '',
  tempUserId: ''
})
const getResponse = async (): Promise<void> => {
}
const wechatlogin = async (): Promise<void> => {
  wechatloginable.value = true
  const data = await getQRcod()
  wechatLoginInfo.value.qrUrl = data?.qrUrl
  wechatLoginInfo.value.tempUserId = data?.tempUserId
  await getResponse()
  QRcodeready.value = true
}
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
const signinSubmit = async (): Promise<void> => {
  await signinFormRef.value.validate()
  const data = await checkPhoneNum(signinForm.value)
  if (data === undefined) {
    ElMessage.error('该手机号已被注册！')
  } else {
    console.log(data, 1)
    ElMessage('注册成功')
    loginIng.value = 0
    signinForm.value = {
      phoneNumber: '',
      password: '',
      nickName: '',
      gender: '男',
      age: 0
    }
  }
}
// 验证码
const pic = ref<picIfo>({
  img: '',
  uuid: ''
})
const picGet = (): void => {
  getNumPiC()
    .then((data) => {
      pic.value.img = data?.img
      pic.value.uuid = data?.uuid
    })
    .catch((err) => {
      console.log(err)
    })
}
onMounted(() => {
  picGet()
})
</script>
<template>
  <div class="loginPage">
    <el-row class="loginview">
      <el-col
        :span="12"
        class="bg"
      />
      <el-col
        :span="12"
        class="formView"
      >
        <h3>PiConnect</h3>
        <el-form
          v-if="loginIng == 0"
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
              @click="loginIng = 1"
            >
              注册
            </el-button>
            <el-button
              style="width: 30%"
              @click="
                async () => {
                  const [err] = await post('/captchaImage', {
                    uuid: pic.uuid,
                    codeOfUser: loginForm.pic,
                  });

                  if (err === null) {
                    await ruleFormRef.value.validate();
                    const [, data] = await post('/user/login', {
                      userName: loginForm.username,
                      password: loginForm.password,
                    });
                    if (data?.code === 400) {
                      ElMessage.error('用户名或密码错误！');
                    } else {
                      console.log(data);
                      ElMessage('登录成功');
                      loginForm = {
                        username: '',
                        password: '',
                        repassword: '',
                        pic: '',
                      };
                      await router.push('/');
                    }
                  }
                }
              "
            >
              登录
            </el-button>
          </div>
        </el-form>
        <el-form
          v-if="loginIng == 1"
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
              @click="loginIng = 0"
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
        <el-form
          v-show="loginIng == 2"
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
              :disabled="enableSendCode"
              @click="subPhonenum"
            >
              {{ sendCodeCtrl }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left: -10px; width: 40%"
              @click="loginIng = 0"
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
          >
          <el-button
            link
            style="height: 100%"
            @click="loginIng = 2"
          >
            手机登录
          </el-button>
          <span>or</span>
          <el-button
            link
            style="height: 100%"
            @click="wechatlogin"
          >
            扫码登录
          </el-button>
          <img
            src="@/assets/wechat.png"
            alt=""
            style="
              width: 20px;
              height: 20px;
              margin-left: 5px;
              vertical-align: middle;
            "
          >
        </div>
      </el-col>
    </el-row>
  </div>
  <el-dialog
    v-model="wechatloginable"
    title="扫码登陆"
    width="350px"
    draggable
  >
    <template #footer>
      <img
        v-if="QRcodeready"
        :src="wechatLoginInfo.qrUrl"
        alt=""
        style="width: 200px; height: 200px; margin-bottom: 50px"
      >
      <img
        v-if="!QRcodeready"
        src="@/assets/loading.png"
        alt=""
        style="width: 200px; height: 200px; margin-bottom: 50px"
      >

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
    overflow: hidden;
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
    }
  }
}
</style>
