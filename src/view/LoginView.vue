<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { type FcResponse, get, post } from "@/utils/index";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";

const loginIng = ref(0);
const router = useRouter();
// 电话登录
const subPhonenumBtn = ref();
const phoneNumFormRef = ref();
interface PhoneNumForm {
  phoneNumber?: number|null;
  code?: string;
  tempKey?: string;
  data?: string;
}
const phoneNumForm = ref<PhoneNumForm>({
  phoneNumber: null,
  code: "",
  tempKey: "",
});
const phoneNumRules = ref<FormRules<PhoneNumForm>>({
  phoneNumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^[1-9]\d{10}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});
const subPhonenum = async () => {
  await phoneNumFormRef.value.validate();
  const phoneNumObject = {
    phoneNumber: phoneNumForm.value.phoneNumber,
  };
  const [err, data] = await post<string>(
    "/user/sendCodeToPhone",
    phoneNumObject
  );
  if (err !== null) {
    console.log(err);
  } else {
    console.log(subPhonenumBtn.value);

    phoneNumForm.value.tempKey = data?.data;
    let timeout = 10;
    const timeoutCtrl = setInterval(() => {
      if (timeout == 1) {
        clearInterval(timeoutCtrl);
      }
      timeout--;
    }, 1000);
  }
};
const submitPhoneNum = async () => {
  const [_, data] = await post<PhoneNumForm>(
    "/user/verifyCode",
    phoneNumForm.value
  );
  if (data?.code===403) {
    ElMessage.error("验证码不匹配！");
  } else {
    console.log(data);
    ElMessage("登录成功");
    router.push('/')
  }
};
// 微信登录相关
const wechatloginable = ref(false);
const QRcodeready = ref(false);
interface wechatQRCode {
  qrUrl?: string;
  tempUserId?: string;
}
const wechatLoginInfo = ref<wechatQRCode>({
  qrUrl: "",
  tempUserId: "",
});
const getQRcod = async (): Promise<FcResponse<wechatQRCode> | undefined> => {
  const [err, data] = await get<wechatQRCode>("/wxUser/wxQr");
  if (err === null) {
    console.error(err);
    ElMessage.error("暂时无法获取！");
    return undefined;
  } else {
    console.log(data);
    return data;
  }
};

const getResponse = async (): Promise<void> => {
  //   // const lock = setInterval(async (): Promise<void> => {
  //   //   const [err, data] = await get(
  //   //     `/wxUser/isLogin?tempUserId=${wechatLoginInfo.value.tempUserId}`
  //   //   )
  //   // }, 1000)
  //   // setTimeout(() => {
  //   //   clearInterval(lock)
  //   // }, 30000)
  //   // const [err, data] = await get(
  //   //     `/wxUser/isLogin?tempUserId=${wechatLoginInfo.value.tempUserId}`
  //   // )
  //   // setTimeout(async () => {
  //   //   await getResponse()
  //   //   return void
  //   // }, 1000)
};
const wechatlogin = async (): Promise<void> => {
  wechatloginable.value = true;
  const data = await getQRcod();
  wechatLoginInfo.value.qrUrl = data?.data.qrUrl;
  wechatLoginInfo.value.tempUserId = data?.data.tempUserId;
  setTimeout(() => {
    QRcodeready.value = true;
    getResponse();
  }, 1000);

  console.log(wechatLoginInfo.value);
};
// 定义登录表单以及规则
const ruleFormRef = ref();
interface LoginForm {
  username?: string;
  password?: string;
  repassword?: string;
  pic?: string;
}
const loginForm = ref<LoginForm>({
  username: "",
  password: "",
  repassword: "",
  pic: "",
});
const loginRules = ref<FormRules<LoginForm>>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^\S{6,12}$/,
      message: "密码必须为6-12位",
      trigger: "blur",
    },
  ],
  repassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== loginForm.value.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback(); // 就算校验成功，也需要callback
        }
      },
      trigger: "blur",
    },
  ],
});
const loginSubmit = async () => {
  const picForm = ref({
    uuid: pic.value.uuid,
    codeOfUser: loginForm.value.pic,
  });
  const loginSubForm = ref({
    userName: loginForm.value.username,
    password: loginForm.value.password,
  });
  const [err, _] = await post("/captchaImage", picForm.value);
  if (err === null) {
    await ruleFormRef.value.validate();
    const [_, data] = await post("/user/login", loginSubForm.value);
    if (data?.code === 400) {
      ElMessage.error("该手机号已经存在用户！");
    } else {
      console.log(data);
      ElMessage("登录成功");
      loginForm.value = {
        username: "",
        password: "",
        repassword: "",
        pic: "",
      };
      router.push("/");
    }
  }
};
// 定义注册表单及其相应规则
const signinFormRef = ref();
interface SigninForm {
  phoneNumber: string;
  password: string;
  nickName: string;
  gender: "女" | "男";
  age: number;
}
const signinForm = ref<SigninForm>({
  phoneNumber: "",
  password: "",
  nickName: "",
  gender: "男",
  age: 0,
});
const signinRules = ref<FormRules<SigninForm>>({
  phoneNumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^[1-9]\d{10}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^\S{6,12}$/,
      message: "密码必须为6-12位",
      trigger: "blur",
    },
  ],
  nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
});
interface signinReturn {
  userId: number;
  userName: string;
  nickName: string;
  gender: "男" | "女";
  phoneNumber: string;
  avatarUrl: null;
  token: string;
  age: number;
  registerDays: null;
}
const signinSubmit = async (): Promise<void> => {
  await signinFormRef.value.validate();
  const [_, data] = await post<signinReturn>(
    "/user/register",
    signinForm.value
  );
  signinForm.value = {
    phoneNumber: "",
    password: "",
    nickName: "",
    gender: "男",
    age: 0,
  };
  if (data?.code === 409) {
    ElMessage.error("该手机号已被注册！");
  } else {
    ElMessage("注册成功");
    loginIng.value = 0;
  }
};
// 验证码
const pic = ref<picIfo>({
  img: "",
  uuid: "",
});
interface picIfo {
  img?: string;
  captchaEnabled?: boolean;
  uuid?: string;
}
const getNumPiC = async (): Promise<void> => {
  const [err, data] = await get<picIfo>("/captchaImage");
  if (err !== null) console.error(err);
  else {
    pic.value.img = data?.data.img;
    pic.value.uuid = data?.data.uuid;
  }
};
onMounted(() => {
  void getNumPiC();
});
</script>
<template>
  <div class="loginPage">
    <el-row class="loginview">
      <el-col :span="12" class="bg" />
      <el-col :span="12" class="formView">
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
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名："
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码："
              type="password"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
            <el-input
              type="password"
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
            <img :src="`data:image/png;base64,${pic.img}`" @click="getNumPiC" />
          </el-form-item>
          <div style="display: flex; justify-content: center; margin-top: 10%">
            <el-button style="width: 30%" @click="loginIng = 1">
              注册
            </el-button>
            <el-button style="width: 30%" @click="loginSubmit">
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
            >
              去登录
            </el-button>
            <el-button style="width: 45%" @click="signinSubmit">
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
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input
              v-model.number="phoneNumForm.phoneNumber"
              placeholder="请输入手机号码"
            />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input
              v-model="phoneNumForm.code"
              style="max-width: 85px; margin-right: 5px"
            />
            <el-button @click="subPhonenum" ref="subPhonenumBtn">
              点击发送
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left: -10px; width: 40%"
              @click="loginIng = 0"
            >
              返回
            </el-button>
            <el-button style="width: 45%" @click="submitPhoneNum">
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
          />
          <el-button link style="height: 100%" @click="loginIng = 2">
            手机登录 </el-button
          ><span>or</span
          ><el-button link @click="wechatlogin"> 扫码登录 </el-button>
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
      .phoneMenu{
        .el-form-item {
          margin-bottom: 10%;
        }
      }
    }
  }
}
</style>
