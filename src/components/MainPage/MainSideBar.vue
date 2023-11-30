<template>
  <div
    class="toggle-button"
    @click="toggleCollapse"
  >
    <el-icon v-if="isCollapse">
      <Expand />
    </el-icon>
    <el-icon v-else>
      <Fold />
    </el-icon>
  </div>
  <el-menu
    background-color="#333744"
    class="el-menu-vertical-demo"
    active-text-color="#ffd04b"
    text-color="#fff"
    router
    default-active="2"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Setting />
        </el-icon>
        <span> 系统界面
        </span>
      </template>
      <el-menu-item-group title="Group One">
        <el-menu-item index="/first">
          界面一
        </el-menu-item>
        <el-menu-item index="/second">
          界面二
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="/third">
          界面三
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="/othermes">
      <el-icon>
        <Location />
      </el-icon>
      <span>  其它信息
      </span>
    </el-menu-item>
    <el-menu-item
      index="/more"
      disabled
    >
      <el-icon>
        <Document />
      </el-icon>
      <span>更多介绍
      </span>
    </el-menu-item>
  </el-menu>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import {
  Document,
  Location,
  Setting,
  Expand,
  Fold
} from '@element-plus/icons-vue'

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]): void => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]): void => {
  console.log(key, keyPath)
}
const toggleCollapse = (): void => {
  isCollapse.value = !isCollapse.value // 切换 isCollapse 的值，实现折叠和展开的切换
  emit('fn')
}
// 向父组件传值
const emit = defineEmits<(event: 'fn') => void>()
</script>
<style lang="scss" scoped>
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  color:#fff;
  text-align: center;
  letter-spacing:0.2em;
  line-height:24px;
  cursor: pointer;
}
.el-menu{
 border:0!important;
}
</style>
