<script setup lang="ts">
import loader from "../layout/loader.vue";
import firstScreen from "../layout/first-screen.vue";
import secondScreen from "./second-screen.vue";
import threeScreen from "./three-screen.vue";
import reusableNavi from "../components/reusable-navi.vue";
import { ref, onMounted, watch } from "vue";

const isLoading = ref(true);
const firstScreenRef = ref<InstanceType<typeof firstScreen>>();
const allowScrollToSecond = ref(false);
const profileTitle = ref("欢迎探索我的频道")
// 监听 isLoading 变化，控制滚动状态
watch(isLoading, (newVal) => {
  const html = document.documentElement;
  const body = document.body;
  if (newVal) {
    // 禁用滚动
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  } else {
    // 加载完成后，是否允许滚动取决于第一屏动画是否完成
    if (allowScrollToSecond.value) {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    } else {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    }
  }
});

watch(
  () => firstScreenRef.value?.animationComplete,
  (newVal) => {
    if (newVal) {
      allowScrollToSecond.value = true;
      // 动画完成后允许滚动
      const html = document.documentElement;
      const body = document.body;
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    }
  }
);

// 初始化时确保加载状态下禁用滚动
  onMounted(() => {
    // 处理已发生的滚动 - 更严格地保持在顶部
    const handleScrollRestriction = () => {
      if (!allowScrollToSecond.value) {
        // 动画未完成时，强制滚动到顶部
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    // 阻止wheel事件（鼠标滚轮滚动）
    const handleWheel = (e: WheelEvent) => {
      if (!allowScrollToSecond.value) {
        e.preventDefault();
      }
    };

    // 阻止touchmove事件（移动端滑动）
    const handleTouchMove = (e: TouchEvent) => {
      if (!allowScrollToSecond.value) {
        e.preventDefault();
      }
    };

    // 阻止键盘滚动键
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!allowScrollToSecond.value) {
        const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'];
        if (scrollKeys.includes(e.key)) {
          e.preventDefault();
        }
      }
    };

    // 添加事件监听器
    window.addEventListener("scroll", handleScrollRestriction, {
      passive: false,
    });
    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    window.addEventListener("keydown", handleKeyDown);

    // 组件卸载时移除所有监听
    return () => {
      window.removeEventListener("scroll", handleScrollRestriction);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

const handleLoaderFinish = () => {
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};
</script>

<template>
  <loader v-if="isLoading" @loaderFinish="handleLoaderFinish" />
  <div class="main-content" v-else>
    <nav>
      <reusableNavi>
        <template #title>
          <div class="title">{{ profileTitle }}</div>
        </template>
      </reusableNavi>
    </nav>
    <div class="firstScreen">
      <firstScreen ref="firstScreenRef" />
    </div>
    <div class="secondScreen" :class="{ 'scroll-locked': !allowScrollToSecond }">
      <secondScreen :isLoading="isLoading" />
    </div>
    <div class="threeScreen" :class="{ 'scroll-locked': !allowScrollToSecond }">
      <threeScreen />
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  /* 禁止水平滚动 */
  background-color: #000;
  /* 与Loader背景一致，避免切换闪白 */
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

nav {
  width: 80%;
  min-width: 300px;
  position: fixed;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.title {
  color: aliceblue;
  font-size: 2em;
  font-family: "Brush Script MT", cursive;
  text-shadow: 0.1em 0.1em 0.1em rgba(214, 189, 233, 0.61), 0 0 2px #fff,
    -1px -1px 0 #101010, 1px -1px 0 #101010, -1px 1px 0 #101010,
    1px 1px 0 #101010;
}

.main-content {
  width: 100vw;
  position: relative;
}

/* 新增：确保第二屏在第一屏下方 */
.firstScreen,
.threeScreen {
  position: relative;
  min-height: 100vh;
  z-index:3;
}

/* 新增：动画未完成时锁定第二屏和第三屏位置 */
.scroll-locked {
  position: fixed !important;
  top: 100vh;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; /* 确保在第一屏下方 */
  pointer-events: none; /* 防止鼠标交互 */
}

/* 动画完成后恢复正常定位 */
.secondScreen,
.threeScreen {
  position: relative;
  min-height: 100vh;
  transition: all 0.3s ease;
}

@media (max-width: 500px) {
  .title {
    font-size: 1rem;
    min-width: 130px;
  }
}
@media (min-width: 501px) and (max-width: 1300px) {
  .title {
    font-size: 1.3rem;
  }
}
</style>
