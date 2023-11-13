<template>
  <el-container style="height: 100vh">
    <el-header>
      <div class="head">
        <div>
          <span>可视化管理系统</span>
        </div>
        <el-menu mode="horizontal" background-color="#373d41" text-color="#fff"  router>
          <el-button type="info" @click="logout">退出</el-button>
          <el-menu-item index="/direction">查看方向</el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-container>
      <el-aside>
        <el-col :span="24">
          <el-menu
            background-color="#333744"
            class="el-menu-vertical-demo"
            active-text-color="#ffd04b"
            text-color="#fff"
            router
          >
            <el-sub-menu index="1">
              <template #title>
                <span>系统界面</span>
              </template>
              <el-menu-item-group title="Group One">
                <el-menu-item index="/first">界面一</el-menu-item>
                <el-menu-item index="/second">界面二</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="/third">界面三</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item index="/othermes">
              <span>其它信息</span>
            </el-menu-item>
            <el-menu-item index="/more" disabled>
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
  name: 'MainPage',
  setup () {
    const router = useRouter()
    const logout = async (): Promise<void> => {
      ElMessage({
        showClose: true,
        type: 'success',
        message: '您已退出登录!'
      })
      await router.push('/login')
    }
    return {
      logout
    }
  }
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
  width: 200px;
  border-bottom-left-radius: 10px;  /* 添加圆角属性 */

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

.el-menu {
  height: 100%;
}

.router-link-active {
  text-decoration: none;
}

a {
  text-decoration: none;
}
</style>
