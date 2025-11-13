<template>
  <div class="overlay">
    <div class="loader">
      <h1 class="logo-line-1">凡是发生</h1>
      <h1 class="logo-line-2">皆有利于我</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
import gsap from "gsap";
import { CustomEase } from "gsap/all";

const emit = defineEmits(["loaderFinish"]);


gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9,0,0.1,1");

document.addEventListener("DOMContentLoaded", () => {
  // 禁用页面滚动（动画期间不允许滚动）
  document.body.style.overflow = "hidden";
    function init() {
    createAnimationTimelines();
  }
  init();

  function createAnimationTimelines() {
    const overlayTimeline = gsap.timeline({
      onComplete: () => {
        // 时间线走完后：触发事件通知父组件、启用滚动、隐藏遮罩
        emit("loaderFinish");
        document.body.style.overflow = "auto";
        const overlay =  document.querySelector(".overlay") as HTMLElement
        overlay.style.display = "none";
      }
    });
    overlayTimeline.to(".logo-line-1", {
      backgroundPosition: "0% 0%",
      color: "#fff",
      duration: .3,
      ease: "none",
      delay: 0.5,
      onComplete: () => {
        gsap.to(".logo-line-2", {
          backgroundPosition: "0% 0%",
          colot: "#fff",
          duration: .3,
          ease: "none",
        });
      },
    });
    overlayTimeline.to([".loader"], {
      opacity: 0,
      duration: 1,
      ease: "none",
      delay: 1,
      color: "#3a3a3a",
    })
  }
});
</script>

<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100svh;
  padding: 2em;
  color: #fff;
  display: flex;
  gap: 2em;
  overflow: hidden;
}
.loader {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.2rem;
  align-items: center;
}
.loader h1 {
  text-align: center;
  font-family: "Microsoft YaHei", "Heiti SC", sans-serif; 
  font-size: 2.5rem;
  font-style: italic;
  line-height: 0.9;
  letter-spacing: 0.05em;
  color: #fff;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  background-size: 100% 200%;
  background-position: 0 100%;
  background-image: linear-gradient(0deg, #3a3a3a, #3a3a3a 50%, #fff 0);;
  color: #3a3a3a;
  letter-spacing: 10px;
    // 启用硬件加速（对scale动画友好）
  will-change: transform;
  
}
</style>
