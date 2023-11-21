<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <div class="head">
    <div>
      <span>可视化管理系统</span>
    </div>
    <div class="header-right">
      <el-menu
        mode="horizontal"
        background-color="#373d41"
        text-color="#fff"
        router
      >
        <el-menu-item index="/direction">
          查看方向
        </el-menu-item>
      </el-menu>

      <el-dropdown trigger="hover">
        <div class="user">
          <el-avatar
            :size="40"
            :src="user.imgUrl"
            style="margin-right: 5px;"
          />
          {{ user.name }}
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="ownpage">
              <img
                src="@/assets/设置.png"
                alt=""
                style="
              width: 20px;
              height: 20px;
              margin-left: 5px;
              vertical-align: middle;
            "
              >
              设置
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <img
                src="@/assets/退出.png"
                alt=""
                style="
              width: 20px;
              height: 20px;
              margin-left: 5px;
              vertical-align: middle;
            "
              >
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
const router = useRouter()
const logout = async (): Promise<void> => {
  ElMessage({
    showClose: true,
    type: 'success',
    message: '您已退出登录!'
  })
  await router.push('/login')
}
const ownpage = (): void => {
  // 设置展示个人信息的页面
}
// 假数据
const user = reactive({
  name: 'admin',
  username: '',
  password: '',
  imgUrl: 'src/assets/loginlogo.JPG'
})
</script>

<style lang="scss" scoped>
body, html {
  margin: 0;
  padding: 0;
  border: 0;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  border-top-left-radius: 10px;  /* 添加圆角属性 */
  border-top-right-radius: 10px; /* 添加圆角属性 */
  box-shadow: rgba(204, 219, 232, 0.5) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
  padding: 0;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-menu {
  /* 垂直居中显示 */
  display: flex;
  align-items: center;
  border-bottom: #373d41;
  /* 移动到顶部栏最右边 */
  margin-left: auto;

  .router-link-active {
  text-decoration: none;
}

a {
  text-decoration: none;
}
}

/* 调整顶部栏的样式 */
.header-right {
  /* 调整为垂直居中 */
  align-items: center;
  display: flex;
}
.el-dropdown{
  cursor: pointer;
}
.user{
  align-items: center;
  display: flex;
  color: #fff;
  font-size: 20px;
}

</style>
