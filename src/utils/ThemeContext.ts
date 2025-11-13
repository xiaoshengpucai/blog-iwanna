import { ref, computed, type Ref, type App, inject, provide } from 'vue'

export interface ThemeState {
  currentTheme: Ref<number>
  isAnimating: Ref<boolean>
  animationPosition: Ref<{ x: number; y: number }>
  animationRadius: Ref<number>
}

export interface ThemeContextType extends ThemeState {
  toggleTheme: (event: MouseEvent) => void
  themes: string[]
  currentThemeColor: Ref<string>
}

// 定义多种主题颜色
export const THEMES = [
  '#161616', // 深蓝黑
  '#d4c0a9ff', // 紫罗兰色
]

// 创建一个Symbol作为注入键
export const ThemeContextKey = Symbol('theme-context')

export const useTheme = () => {
  const context = inject<ThemeContextType>(ThemeContextKey)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// ThemeProvider 组件
export const ThemeProvider = {
  install: (app: App) => {
    const currentTheme = ref(0)
    const isAnimating = ref(false)
    const animationPosition = ref({ x: 0, y: 0 })
    const animationRadius = ref(0)

    const toggleTheme = (event: MouseEvent) => {
      if (isAnimating.value) return

      // 记录全局点击位置，用于裁切动画
      animationPosition.value = {
        x: event.clientX,
        y: event.clientY
      }
      animationRadius.value = 0
      isAnimating.value = true

      // 切换到下一个主题
      currentTheme.value = (currentTheme.value + 1) % THEMES.length

      // 计算覆盖全屏所需的最大半径
      const maxDimension = Math.max(window.innerWidth, window.innerHeight)
      const radius = Math.sqrt(maxDimension * maxDimension * 2) // 对角线长度

      // 开始动画
      const startTime = performance.now()
      const duration = 1000 // 动画持续时间（毫秒）

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // 使用缓动函数加速动画
        const easing = (t: number) => 1 - Math.pow(1 - t, 3)
        animationRadius.value = radius * easing(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // 动画完成
          setTimeout(() => {
            isAnimating.value = false
          }, 50) // 稍微延迟一下，确保视觉效果完整
        }
      }

      requestAnimationFrame(animate)
    }

    const themes = THEMES
    const currentThemeColor = computed(() => THEMES[currentTheme.value])

    const themeState: ThemeContextType = {
      currentTheme,
      isAnimating,
      animationPosition,
      animationRadius,
      toggleTheme,
      themes,
      currentThemeColor
    }

    app.provide('theme', themeState)
    app.provide(ThemeContextKey, themeState)
  }
}