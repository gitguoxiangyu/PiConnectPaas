<template>
  <el-container style="height:100vh">
    <el-header>
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <div>
        <span>可视化管理系统</span>
      </div> 
      
      <el-menu mode="horizontal" background-color="#373d41" text-color="#fff" menu-align="end" padding="0" margin="0">
       <el-button type="info" @click="logout">退出</el-button>
          <router-link to="/direction">
            <el-menu-item index="2">查看方向</el-menu-item>
          </router-link>
        </el-menu>
      </div>
    </el-header>
    <el-container>
      <el-aside>
        <el-col :span="24">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#333744"
        class="el-menu-vertical-demo"
        text-color="#fff"
      >
        <el-sub-menu index="1">
          <template #title>
            <span>系统界面</span>
          </template>
          <el-menu-item-group title="Group One">
            <router-link to="/first">
              <el-menu-item index="1-1">界面一</el-menu-item>
            </router-link>
            <router-link to="/second">
              <el-menu-item index="1-2">界面二</el-menu-item>
            </router-link>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">界面三</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <router-link to="/othermes">
          <el-menu-item index="2">
            <span>其它信息</span>
          </el-menu-item>
        </router-link>
        <el-menu-item index="3" disabled>
          <span>更多介绍</span>
        </el-menu-item>
      </el-menu>
    </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Home',
  setup () {

    const router = useRouter()

    const logout = () => {
      ElMessage({
        showClose: true,
        type: 'success',
        message: '您已退出登录!'
      })
      router.push('/login')
    }
    return {
      logout,
    }
  }
})
</script>

<style scoped>
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
  img {
    width: 50px;
    height: 50px;
  }
}
.el-aside {
  background-color: #333744;
  width: 200px;
  .el-menu {
    border-right: none;
    border: 0 !important;
  }
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
.el-menu{
     height:100% 
 }
 .router-link-active{
    text-decoration: none;
  }
a{
    text-decoration: none;
}

</style>