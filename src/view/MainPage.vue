<template>
  <el-container
    style="height: 100vh"
    @click="closeperson"
  >
    <el-header>
      <!-- 头部组件 -->
      <MainHeader
        @fn1="personpage"
      />
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '65px' : '220px'">
        <MainSideBar
          :is-collapse="collapse"
          @fn="sidebar"
        />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>

  <el-card
    class="box-card"
    :style="{ width: personopen ? '300px' : '0px' }"
  >
    <template #header>
      <div class="card-header">
        <span>这里用来展示用户信息</span>
        <el-button
          class="button"
          text
          @click="closeperson"
        >
          关闭
        </el-button>
      </div>
    </template>
    <div
      class="text item"
    >
      <p>用户姓名：{{ user.name }}</p>
      <p>用户：{{ user.username }}</p>
    </div>
    <template #footer>
      Footer content
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import MainHeader from '../components/MainPage/MainHeader.vue'
import MainSideBar from '../components/MainPage/MainSideBar.vue'
import { ref, reactive } from 'vue'
const collapse = ref(false)
const personopen = ref(false)
const sidebar = (): void => {
  collapse.value = !collapse.value
}
const personpage = (): void => {
  personopen.value = !personopen.value
}
const closeperson = (): void => {
  personopen.value = false
}
const user = reactive({
  name: 'admin',
  username: 'bbb',
  password: 'ddd',
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

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }

  .el-menu {
    border-right: none;
    border: 0 !important;
    display: flex;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  img {
    width: 50px;
    height: 50px;
  }
}

.el-aside {
  background-color: #333744;
  transition: width 0.2s;
  border-bottom-left-radius: 10px;  /* 添加圆角属性 */
  border:0!important;

}
.el-menu{
  border: 0 !important;
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.router-link-active {
  text-decoration: none;
}

a {
  text-decoration: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  z-index: 3;
  position: absolute;
  transition: width 0.2s;
  // 设置宽度变化速度
  top:0;
  bottom: 0;
  right: 0;
}
</style>
