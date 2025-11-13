import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { ThemeProvider } from './utils/ThemeContext'

// 创建应用实例
const app = createApp(App)

// 安装主题提供者插件
app.use(ThemeProvider)

// 挂载应用
app.mount('#app')
