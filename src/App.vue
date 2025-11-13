<template>
  <!-- 背景容器用于显示颜色扩散效果 -->
  <div 
    class="app-container"
    :style="{ backgroundColor: currentThemeColor }"
  >
    <!-- 颜色扩散动画层 -->
    <div 
      v-if="isAnimating" 
      class="theme-transition-layer"
      :style="animationStyle"
    ></div>
    
    <!-- 应用内容 -->
    <IndexVue />
  </div>
</template>

<script setup lang="ts">
import IndexVue from "./layout/index.vue";
import { computed } from 'vue';
import { useTheme } from './utils/ThemeContext';

// 使用主题上下文
const { 
  isAnimating, 
  animationPosition, 
  animationRadius, 
  currentThemeColor 
} = useTheme();

// 计算动画样式 - 修复类型兼容性问题
const animationStyle = computed(() => {
  const { x, y } = animationPosition.value;
  const radius = animationRadius.value;
  
  // 使用Vue 3兼容的样式对象格式
  const styles: any = {
    backgroundColor: currentThemeColor.value,
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    left: `${x - radius}px`,
    top: `${y - radius}px`,
    transform: 'scale(1)',
    borderRadius: '50%',
    position: 'fixed' as const,
    zIndex: 1, // 使用数值而不是字符串
    transition: 'transform 1s ease-out',
    pointerEvents: 'none' as const
  };
  
  return styles;
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  width: 100%;
  transition: background-color 0s ease 1s;
  position: relative;
  overflow-x: hidden;
}

.theme-transition-layer {
  will-change: transform;
}
</style>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
