<template>
  <el-button
    type="primary"
    :onclick="reloadDevice"
  >
    刷新
  </el-button>
  <div class="container">
    <div class="grid-container">
      <div
        v-for="(device, index) in devices"
        :key="index"
        class="grid-item"
        :onclick="loadchart"
      >
        <div class="device-name">
          {{ device.device_name }}
        </div>
        <div class="sensor-info">
          <div class="temperature">
            <span class="label">温度:</span> {{ device.temperature }}℃
          </div>
          <div class="humidity">
            <span class="label">湿度:</span> {{ device.humidity }}%
          </div>
        </div>
        <div
          class="online-status"
          :class="{online: device.status === 'Online', offline: device.status !== 'Online'}"
        >
          {{ device.status === "Online" ? '在线' : '离线' }}
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogTable"
    title="仪表盘"
  >
    <div class="chart_container">
      <div
        id="charts"
        :style="{ width: '400px', height: '300px' }"
      />
      <div
        id="humidity"
        :style="{ width: '400px', height: '300px' }"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import monitor from './monitor.json'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const devices = reactive(monitor)
const dialogTable = ref(false)
const reloadDevice = (): void => {
  ElMessage({
    showClose: false,
    message: '正在拉取设备信息',
    type: 'success',
    duration: 3000
  })
  setTimeout(() => {
    devices.unshift({
      device_name: '树莓派',
      temperature: 10.1,
      humidity: 20,
      cpu_usage: 20,
      memory_usage: 31,
      status: 'Online',
      account_type: 'Admin'
    })
  }, 3000)
}

setInterval(() => {
  devices.forEach((item) => {
    if (item.status === 'Online') {
      item.temperature = Number((item.temperature + Math.random()).toFixed(2))
      item.humidity = Number((item.humidity + Math.random()).toFixed(2))
      item.temperature = Number((item.temperature - Math.random()).toFixed(2))
      item.humidity = Number((item.humidity - Math.random()).toFixed(2))
    }
  })
}, 5000)

const loadchart = () => {
  dialogTable.value = true
  setTimeout(init, 0)
}

const init = function (): void {
  const chart = echarts.init(document.getElementById('charts'))
  const humidity = echarts.init(document.getElementById('humidity'))
  // 把配置和数据放这里
  chart.setOption({
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 60,
        splitNumber: 12,
        itemStyle: {
          color: '#FFAB91'
        },
        progress: {
          show: true,
          width: 30
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          distance: -45,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: -52,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -20,
          color: '#999',
          fontSize: 20
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 30,
          fontWeight: 'bolder',
          formatter: '{value} °C',
          color: 'inherit'
        },
        data: [
          {
            value: devices[0].temperature
          }
        ]
      },
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 60,
        itemStyle: {
          color: '#FD7347'
        },
        progress: {
          show: true,
          width: 8
        },
        pointer: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          show: false
        },
        data: [
          {
            value: devices[0].temperature
          }
        ]
      }
    ]
  })

  humidity.setOption({
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: 'Pressure',
        type: 'gauge',
        detail: {
          formatter: '{value}'
        },
        data: [
          {
            value: devices[0].humidity,
            name: 'humidity'
          }
        ]
      }
    ]
  })
  setInterval(function () {
    const random = devices[0].temperature
    chart.setOption({
      series: [
        {
          data: [
            {
              value: random
            }
          ]
        },
        {
          data: [
            {
              value: random
            }
          ]
        }
      ]
    })

    const humidityradom = devices[0].humidity
    humidity.setOption({
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      series: [
        {
          name: 'Pressure',
          type: 'gauge',
          detail: {
            formatter: '{value}'
          },
          data: [
            {
              value: humidityradom,
              name: 'humidity'
            }
          ]
        }
      ]
    })
  }, 2000)
  window.onresize = function () {
    // 自适应大小
    chart.resize()
  }
}
</script>

<style>
.chart_container{
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
}
.container {
  display: flex;
  justify-content: start;
  flex-direction: row;
  height: 100vh;
}

.grid-container {
  display: flex;
  justify-content: start;
  flex-direction: row;
  flex-wrap: wrap;
}

.grid-item {
  background-color: rgb(234, 234, 234);
  padding: 10px;
  height: 200px;
  width: 200px;
  border-radius: 5px;
  margin: 30px 30px;
  /* x 偏移量 | y 偏移量 | 阴影颜色 */
box-shadow: 5px 5px rgb(218, 218, 218);
}

.device-name {
  font-weight: bold;
  margin-bottom: 10px;
}

.sensor-info {
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
}

.online-status {
  font-weight: bold;
}

.online {
  color: green;
}

.offline {
  color: red;
}
</style>
