<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { wechatQRCode } from '@/type/login'
import { getQRcod } from '@/api/login'
const router = useRouter()
/**
 * 微信登录
 */
const wechatloginable = ref(false)
const QRcodeready = ref(false)
// 定义微信登录
const wechatLoginInfo = ref<wechatQRCode>({
  qrUrl: '',
  tempUserId: ''
})
const getResponse = async (): Promise<void> => {
  // 微信登录的函数，暂时不写 先放这里喵
}
/**
 * 执行微信登录操作:首先调出微信二维码，然后调用 getResponse轮询
 */
const wechatlogin = async (): Promise<void> => {
  wechatloginable.value = true
  const data = await getQRcod()
  wechatLoginInfo.value.qrUrl = data?.qrUrl
  wechatLoginInfo.value.tempUserId = data?.tempUserId
  await getResponse()
  QRcodeready.value = true
}
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
        <router-view />
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
            @click="router.push('/login/phonenum')"
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
        style="width: 200px; height: 200px; margin-bottom: 50px"
      >
      <img
        v-if="!QRcodeready"
        class="wechatCodeimg"
        src="@/assets/loading.png"
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
    }
  }
}
</style>
