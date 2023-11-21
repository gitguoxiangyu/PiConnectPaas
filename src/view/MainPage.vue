<template>
  <el-container style="height: 100vh">
    <el-header>
      <!-- 头部组件 -->
      <MainHeader />
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '65px' : '220px'">
        <MainSideBar
          :is-collapse="collapse"
          @fn="chanNum"
        />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import MainHeader from '../components/MainPage/MainHeader.vue'
import MainSideBar from '../components/MainPage/MainSideBar.vue'
import { ref } from 'vue'
const collapse = ref(false)
const chanNum = (): void => {
  collapse.value = !collapse.value
}

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
</style>
