<template>
  <div class="first-screen">
    <div class="image-container">
      <!-- 主图使用预加载策略 -->
      <img src="https://i.postimg.cc/ZngsqqxC/4.webp" alt="Fullscreen image" class="fullscreen-img" loading="eager"
        decoding="async" />
    </div>
    <div class="overlay">
      <div class="projects">
        <div class="projects-header">
          <p class="section-title">learning phase</p>
          <p class="section-title">learning Projects</p>
        </div>
      </div>
      <div class="locations">
        <div class="locations-header">
          <p>learning goals</p>
        </div>
      </div>
    </div>

    <div class="first-header">
      <h1 class="header-text">hello 朋友!</h1>
      <h2 class="header-text">一切开始皆缘自"hello word".</h2>
    </div>
    <div class="image-grid">
      <!-- 使用v-for循环渲染图片网格 -->
      <div v-for="(row, rowIndex) in getGridImages" :key="`row-${rowIndex}`" class="grid-row">
        <div v-for="image in row" :key="image.id" class="img" :class="{ 'hero-img': image.isHero }">
          <!-- 优化图片加载，英雄图片优先加载，其他图片懒加载 -->
          <img :src="image.isHero ? image.setUrl : image.setUrl" :alt="`Image ${image.id}`"
            :loading="image.isHero ? 'eager' : 'lazy'" decoding="async" />
        </div>
      </div>
    </div>
    <section>
      <div class="profile">
        <h3>我是小陈，会点小代码，每天敲几行，慢慢成长。</h3>
        <h3>会vue,uiapp,wx小程序</h3>
        <p>在北玩过电商，在南戏耍潮玩，医院医疗项目</p>
      </div>
    </section>
    <div class="banner-img banner-img-1">
      <!-- 横幅图片使用懒加载 -->
      <img src="https://i.postimg.cc/y6rbjf4y/9.webp" alt="Banner image 1" loading="lazy" decoding="async" />
    </div>
    <div class="banner-img banner-img-2">
      <img src="https://i.postimg.cc/D0DpzzP2/image.webp" alt="Banner image 2" loading="lazy" decoding="async" />
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import { SplitText } from "gsap/SplitText";
import { onMounted, ref, nextTick, computed, onBeforeUnmount } from "vue"; // 新增nextTick确保DOM加载完成
import { projects as projectsDatas } from "../assets/data/project";
import { images, type ImageData } from "../assets/data/Imagesdata"; // 使用正确的相对路径

gsap.registerPlugin(CustomEase, SplitText);
CustomEase.create("cropToFull", "0.2,0,0.1,1");
CustomEase.create("hop", "0.9,0,0.1,1");

let girdImages: gsap.TweenTarget[];
let heroImage: HTMLElement | null;
let nonHeroImages: gsap.TweenTarget[];

// 使用计算属性将图片数据转换为3x3网格格式
let selectedImages: ImageData[] = [];
// 预加载图片缓存
let preloadedImages = new Map<string, HTMLImageElement>();
const getGridImages = computed(() => {
  const grid: ImageData[][] = [];

  selectedImages = getRandomImageSet()
    .slice(0, 9)
    .map((img) => ({
      ...img,
      isHero: false, // 重置所有图片的isHero状态
    }));

  selectedImages[4].isHero = true; // 索引5是第六张图片
  for (let i = 0; i < images.length; i += 3) {
    grid.push(selectedImages.slice(i, i + 3));
  }
  return grid.slice(0, 3);
});

const isSmallScreen = ref(window.innerWidth < 500);
const animationComplete = ref(false);

// 图片错误处理函数
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  // 设置备用图片
  target.src =
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23888%22 font-family=%22Arial%22 font-size=%2216%22 text-anchor=%22middle%22 x=%22100%22 y=%22100%22 dominant-baseline=%22middle%22%3E图片加载失败%3C/text%3E%3C/svg%3E";
  target.style.opacity = "0.6";
}

// 预加载关键图片函数
function preloadCriticalImages() {
  // 获取需要优先加载的图片URLs
  const criticalImages = getRandomImageSet()
    .slice(0, 3)
    .map((img) => img.setUrl);
  const mainImageUrl = "https://i.postimg.cc/ZngsqqxC/4.webp";

  // 添加主图到关键图片列表
  if (!criticalImages.includes(mainImageUrl)) {
    criticalImages.unshift(mainImageUrl);
  }

  // 预加载图片
  criticalImages.forEach((url) => {
    if (!preloadedImages.has(url)) {
      const img = new Image();
      img.src = url;
      img.decode().catch(() => {
        console.warn(`Failed to preload image: ${url}`);
      });
      preloadedImages.set(url, img);
    }
  });
}

// 使用事件委托处理图片错误
function setupImageErrorHandling() {
  const firstScreenEl = document.querySelector(".first-screen");
  if (firstScreenEl) {
    // 保存监听器函数引用
    const errorHandler = (event: Event) => {
      const target = event.target as HTMLImageElement;
      // 检查是否是图片元素触发的错误
      if (target.tagName.toLowerCase() === "img") {
        handleImageError(event);
      }
    };

    firstScreenEl.addEventListener("error", errorHandler, true); // 使用捕获阶段监听

    // 保存监听器引用以便后续移除
    return () => {
      firstScreenEl.removeEventListener("error", errorHandler, true);
    };
  }
  return null;
}

// 存储事件监听器清理函数
let cleanupImageErrorListener: (() => void) | null = null;

// 组件卸载前清理资源
onBeforeUnmount(() => {
  // 清理预加载的图片缓存
  preloadedImages.clear();

  // 移除事件监听器
  window.removeEventListener("resize", handleResize);
  // 安全地移除滚动事件监听器
  try {
    window.removeEventListener("scroll", handleScroll);
  } catch (e) {
    // 忽略可能的错误
  }

  // 移除图片错误事件委托
  if (cleanupImageErrorListener) {
    cleanupImageErrorListener();
  }
});

// 定义handleResize函数以支持在onBeforeUnmount中移除
function handleResize() {
  isSmallScreen.value = window.innerWidth < 500;
}

// 存储滚动处理函数引用
let handleScroll: EventListenerOrEventListenerObject = () => { };

onMounted(async () => {
  // 已经在外部定义了handleResize函数，直接使用
  window.addEventListener("resize", handleResize, { passive: true });
  handleResize(); // 初始化

  // 预加载关键图片
  preloadCriticalImages();

  // 确保DOM完全加载后再初始化所有功能
  await nextTick();

  initImageElements();
  initializeDynamicContent();
  initFullscreenImageAnimation();
  const heroTimeline = createAnimationTimelines();

  // 初始化滚动动画并保存引用
  initFirstScreenScrollAnimation();

  // 设置图片错误事件委托
  cleanupImageErrorListener = setupImageErrorHandling();

  startImageRotation();

  heroTimeline.eventCallback("onComplete", () => {
    setTimeout(() => {
      animationComplete.value = true;
      setTimeout(() => {
        document.body.style.overflow = "auto";
        document.body.style.touchAction = "auto";
      }, 50);
    }, 300);
  });
});

function initializeDynamicContent() {
  const projects = document.querySelector(".projects") as HTMLElement;
  const locations = document.querySelector(".locations") as HTMLElement;

  projectsDatas.forEach((data) => {
    const projectItem = document.createElement("div");

    projectItem.className = "projects-item";
    projectItem.style.opacity = "0";
    projectItem.style.visibility = "hidden";
    projectItem.style.color = "#4f4f4f";
    projectItem.style.display = "flex";
    projectItem.style.justifyContent = "space-between";

    const projectName = document.createElement("p");
    projectName.textContent = data.name;
    const projectDirector = document.createElement("p");
    projectDirector.textContent = data.director;

    projectItem.appendChild(projectName);
    projectItem.appendChild(projectDirector);
    projects.appendChild(projectItem);
  });
  projectsDatas.forEach((data: any) => {
    const locationsItem = document.createElement("div");
    locationsItem.className = "locations-item";
    // 新增：创建时就设置隐藏状态
    locationsItem.style.opacity = "0";
    locationsItem.style.visibility = "hidden";
    locationsItem.style.color = "#4f4f4f";
    locationsItem.style.textAlign = "left";
    const locationsName = document.createElement("p");
    locationsName.textContent = data.location;

    locationsItem.append(locationsName);
    locations.append(locationsItem);
  });
}

function initImageElements() {
  girdImages = gsap.utils.toArray(".img");
  heroImage = document.querySelector(".hero-img");
  nonHeroImages = girdImages.filter((img) => img !== heroImage);
  gsap.set(girdImages, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  });
}

function initFullscreenImageAnimation() {
  const img = document.querySelector(".fullscreen-img");
  if (!img) return;

  const fullscreenTl = gsap.timeline({
    defaults: { duration: 1, ease: "cropToFull" },
    onComplete: () => {
      gsap.delayedCall(0.5, () => startImageRotation());
    },
  });

  gsap.set(img, {
    scale: 1.2,
    clipPath: "polygon(40% 40%, 60% 40%, 60% 60%, 40% 60%)",
    opacity: 0,
  });

  fullscreenTl
    .to(img, {
      opacity: 1,
      clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
      duration: 0.5,
    })
    .to(img, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      scale: 1,
      duration: 0.5,
    });
}
// 获取当前窗口宽度对应的scale值
const getScaleValue = () => {
  const width = window.innerWidth;
  // 根据不同宽度范围设置不同的scale值
  if (width >= 501 && width <= 899) {
    return 6;
  } else if (width >= 900 && width <= 1300) {
    return 4; // 900-1300px时scale为4
  } else if (isSmallScreen.value) {
    return 3; // 小屏幕时scale为3
  } else {
    return 4; // 其他情况scale为4
  }
};
function createAnimationTimelines() {
  if (!girdImages || !nonHeroImages) return gsap.timeline();
  const overlayTimeline = gsap.timeline();
  const imageTimeline = gsap.timeline({ defaults: { ease: "hop" } });

  // 预先设置will-change属性以优化GPU渲染
  gsap.set(girdImages, {
    willChange: "clip-path, transform",
  });

  const HeaderSplit = SplitText.create(".first-header", {
    type: "chars",
    charsClass: "animated-text",
  });

  // 设置文本元素的will-change属性
  gsap.set(HeaderSplit.chars, {
    willChange: "transform, opacity",
    opacity: 0,
    y: 100,
    rotate: -20,
    color: getRandomHexColor(),
    textShadow: `.2em .2em .2em ${getRandomHexColor()}`,
  });

  overlayTimeline.to([".projects-header", ".locations-header"], {
    x: -150,
    color: "#fff",
    duration: 0.15,
    stagger: 0.075,
  });

  overlayTimeline.to([".projects-header", ".projects-item"], {
    x: 0,
    opacity: 1,
    visibility: "visible",
    duration: 1.5,
    stagger: 0.075,
    delay: 1,
  });

  overlayTimeline.to(
    [".locations-header", ".locations-item"],
    {
      x: 0,
      opacity: 1,
      visibility: "visible",
      duration: 0.15,
      stagger: 0.075,
    },
    "<"
  );
  overlayTimeline.to(".projects-item", {
    color: "#ccc",
    duration: 0.15,
    stagger: 0.075,
  });

  overlayTimeline.to(
    ".locations-item",
    {
      color: "#ccc",
      duration: 0.15,
      stagger: 0.075,
    },
    "<"
  );
  overlayTimeline.to(HeaderSplit.chars, {
    y: 0,
    opacity: 1,
    stagger: 0.05,
    scale: 1.2,
    rotate: 0,
  });
  overlayTimeline.to([".projects-header", ".projects-item"], {
    opacity: 0,
    duration: 0.15,
    stagger: 0.075,
  });

  overlayTimeline.to(
    [".locations-header", ".locations-item"],
    {
      opacity: 0,
      duration: 0.15,
      stagger: 0.075,
    },
    "<"
  );
  imageTimeline.to(
    ".img",
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      delay: 1,
      stagger: 0.05,
      onStart: () => {
        setTimeout(() => startImageRotation(), 1000);
      },
    },
    ">0.5"
  );

  imageTimeline.to(
    nonHeroImages,
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      delay: 2.5,
      stagger: 0.05,
    },
    ">"
  );

  const heroTl = gsap.timeline({
    parent: imageTimeline,
    defaults: { ease: "hop" },
  });

  // 获取当前窗口宽度对应的right位置
  const getRightPosition = () => {
    const width = window.innerWidth;
    // 小屏幕居中，其他情况保持原位
    return isSmallScreen.value ? "auto" : "-85%";
  };

  window.addEventListener("resize", () => {
    if (heroImage) {
      // 使用函数动态计算scale和right值
      gsap.set(heroImage, {
        right: getRightPosition(),
        scale: getScaleValue(),
      });
    }
  });

  heroTl
    .to(".hero-img", {
      y: 0,
      right: getRightPosition(),
      duration: 1,
    })
    .to(".hero-img", {
      scale: getScaleValue(),
      clipPath: "polygon(20% 10%, 80% 10%, 80% 90%, 20% 90%)",
      duration: 1.5,
      onStart: () => {
        gsap.to(".hero-img img", {
          scale: 1,
          duration: 1.5,
          ease: "hop",
        });
      },
    });

  imageTimeline.to(".banner-img-1", {
    translate: "-50% -50%",
    left: "65%",
    scale: 1,
    rotate: -15,
  });
  imageTimeline.to(".banner-img-2", {
    translate: "-50% -50%",
    left: "85%",
    scale: 1,
    rotate: 15,
  });

  HeaderSplit.chars.forEach((item) => {
    overlayTimeline.to(item, {
      opacity: 1,
      y: 0,
      rotate: 0,
      color: "#fff",
      scale: 1.2,
      duration: 0.015,
      textShadow: `0.2rem 0.2rem 0.1rem #4f4f4f,.1em .1em .1em ${getRandomHexColor()}`,
      stagger: 0.05,
      yoyo: true,
      ease: "circ.inOut",
    });
  });
  // 添加清理函数，在动画完成后移除will-change属性
  heroTl.eventCallback("onComplete", () => {
    requestAnimationFrame(() => {
      // 移除will-change属性以节省GPU资源
      gsap.set(girdImages, {
        willChange: "",
      });
      gsap.set(HeaderSplit.chars, {
        willChange: "",
      });
    });
  });

  return heroTl;
}

function getRandomHexColor() {
  // 生成 0-16777215 之间的随机数（对应十六进制 0xffffff）
  const randomNum = Math.floor(Math.random() * 16777216);
  // 转换为十六进制，并补全 6 位（不足的前面加 0）
  return "#" + randomNum.toString(16).padStart(6, "0");
}
// 获取随机图片集的函数
const getRandomImageSet = () => {
  // 使用共享的随机函数获取随机图片URLs
  // return getRandomImageUrls(9); // 获取9张随机图片.map((img) => img.setUrl);
  return [...images].sort(() => Math.random() - 0.5).slice(0, 9);
};
function startImageRotation() {
  let cycle = 0;
  const maxCycles = 20;
  const intervalTime = 150; // 150ms 代替 0.15s

  // 使用requestAnimationFrame和setTimeout组合创建更高效的动画循环
  function animateNextCycle() {
    if (cycle < maxCycles) {
      // 在requestAnimationFrame中更新DOM
      requestAnimationFrame(() => {
        // 优化：只在需要时获取新的图片集合
        const randomImages = getRandomImageSet().map((img) => img.setUrl);

        // 只更新需要改变的图片元素，并避免不必要的DOM操作
        girdImages.forEach((img, i) => {
          const imgEl = (img as HTMLElement).querySelector(
            "img"
          ) as HTMLImageElement;
          if (imgEl) {
            // 检查是否需要更新src，避免不必要的重渲染
            if (cycle === maxCycles - 1 && img === heroImage) {
              // 最后一帧特殊处理hero图片
              const randomImage = selectedImages.find((item) => item.isHero);
              if (randomImage) {
                imgEl.src = randomImage.url;
              }
            } else if (
              cycle < maxCycles &&
              imgEl.src !== randomImages[i]
            ) {
              // 预加载下一张图片以确保平滑过渡
              if (!preloadedImages.has(randomImages[i])) {
                const preloadImg = new Image();
                preloadImg.src = randomImages[i];
                preloadedImages.set(randomImages[i], preloadImg);
              }
              imgEl.src = randomImages[i];
            }
          }
        });
      });

      cycle++;
      // 使用setTimeout控制下一帧的时间
      setTimeout(animateNextCycle, intervalTime);
    } else {
      // 动画完成后清理不再使用的预加载图片
      cleanupUnusedImages();
    }
  }

  // 启动动画循环
  animateNextCycle();
}

// 清理不再使用的预加载图片
function cleanupUnusedImages() {
  // 获取当前正在使用的图片URLs
  const currentImageUrls = new Set<string>();
  girdImages.forEach((img) => {
    const imgEl = (img as HTMLElement).querySelector("img") as HTMLImageElement;
    if (imgEl && imgEl.src) {
      currentImageUrls.add(imgEl.src);
    }
  });

  // 清理不再使用的图片缓存
  for (const [url, img] of preloadedImages.entries()) {
    if (!currentImageUrls.has(url)) {
      // 释放图片资源
      img.src = "";
      preloadedImages.delete(url);
    }
  }
}

// 节流函数实现
function throttle<T extends (...args: any[]) => any>(func: T, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 第一屏滚动动画（随滚动向上移动并淡出）
function initFirstScreenScrollAnimation() {
  const fullscreenImg = document.querySelector(".first-screen");
  if (!fullscreenImg) return;

  // 使用节流函数优化滚动事件
  const handleScroll = throttle(() => {
    if (!animationComplete.value) return;

    // 使用requestAnimationFrame确保动画流畅
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const halfViewpotHeight = window.innerHeight * 0.5;

      // 随滚动改变第一屏位置和透明度
      gsap.set(fullscreenImg, {
        y: Math.max(-scrollY, -window.innerHeight),
        scale: 1 + Math.min((scrollY / halfViewpotHeight) * 0.1, 1),
        opacity: 1 - Math.min(scrollY / window.innerHeight, 1),
      });

      // 设置背景图片的移动和透明度
      gsap.set(".banner-img-1", {
        x: -scrollY,
        opacity: 1 - Math.min(scrollY / halfViewpotHeight, 1),
      });

      gsap.set(".banner-img-2", {
        x: scrollY,
        opacity: 1 - Math.min(scrollY / halfViewpotHeight, 1),
      });

      // 设置hero图片的缩放和透明度
      gsap.set(heroImage, {
        scale: getScaleValue() + Math.min(scrollY / (halfViewpotHeight * 2), 4),
        opacity: 1 - Math.min(scrollY / halfViewpotHeight, 1),
      });

      // 设置头部的移动
      gsap.set(".first-header", {
        y: -scrollY,
      });
    });
  }, 16); // 约60fps

  window.addEventListener("scroll", handleScroll, { passive: true });
}

defineExpose({
  animationComplete,
});
</script>

<style scoped>
/* 第一屏基础样式 */
.first-screen {
  position: fixed;
  inset: 0;
  /* 简化top/left/width/height */
  min-width: 400px;
  z-index: 2;
}

/* 导航样式 */
nav {
  display: flex;
  width: 80vw;
  height: 6svh;
  justify-content: space-between;
  position: fixed;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 头部样式优化 */
.first-header {
  position: absolute;
  min-width: 80%;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1em;
  color: #fff;
  font-size: 1.5em;
}

/* 统一头部文本样式，减少嵌套 */
.header-text {
  font-family: "Brush Script MT", cursive;
  font-weight: 600;
  text-shadow: 0.2rem 0.2rem 0.1rem #4f4f4f;
  text-transform: uppercase;
  letter-spacing: 5px;
  will-change: transform, opacity;
  /* GPU优化 */
}

.first-header h1 {
  min-width: 350px;
  text-align: center;
}

.first-header h2 {
  min-width: 580px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 侧边覆盖层样式 */
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2em;
  z-index: 2;
}

/* 项目和位置区域合并样式 */
.projects,
.locations {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: "Durk", sans-serif;
  font-weight: 500;
  margin: 30px;
}

.projects {
  width: 30%;
}

.locations {
  width: 20%;
  text-align: left;
}

/* 标题区域样式 */
.locations-header,
.projects-header {
  opacity: 0;
  display: flex;
  gap: 1em;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 15px 0;
  justify-content: space-between;
  will-change: opacity;
  /* GPU优化 */
}

/* 标题文本样式 */
.section-title {
  text-align: center;
  font-family: "Durk", sans-serif;
  font-weight: 500;
  font-style: italic;
  text-transform: uppercase;
}

/* 背景图片容器 */
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  inset: 0;
  /* 简化top/left/width/height */
  position: absolute;
  overflow: hidden;
  backdrop-filter: blur(10px);
  opacity: 0.5;
  z-index: -1;
}

.fullscreen-img {
  width: 100%;
  height: 80%;
  border-radius: 2%;
  object-fit: cover;
  will-change: transform;
  /* GPU优化 */
  border: none;
  filter: saturate(0.5);
}

/* 个人资料区域 */
.profile {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 5%;
  font-size: 1.5em;
}

/* 图片网格样式 */
.image-grid {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  gap: 1em;
  z-index: 2;
}

.grid-row {
  width: 100%;
  display: flex;
  gap: 1em;
}

/* 图片容器优化 */
.img {
  position: relative;
  flex: 1;
  aspect-ratio: 1;
  overflow: hidden;
  will-change: transform;
  /* GPU优化 */
}

/* 统一图片样式 */
.img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  /* 添加过渡效果 */
}

.img:hover img {
  transform: scale(1.05);
  /* 轻微放大效果 */
}

/* 横幅图片样式 */
.banner-img {
  position: absolute;
  top: 50%;
  transform: scale(0) translate(-50%, -50%);
  width: 20%;
  aspect-ratio: 4/5;
  z-index: 1;
  will-change: transform, opacity;
  /* GPU优化 */
}

/* 第二屏内容样式 */
.section-content {
  position: absolute;
  transform: translate(-50%, -50%);
  text-align: center;
  /* 确保过渡平滑 */
  transition: left 0.1s ease-out, opacity 0.1s ease-out;
}

.animated-text {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  /* transform-origin: left center; */
}

/* 优化媒体查询结构，按照需求的三个断点 */

/* 500px以下 */
@media (max-width: 500px) {

  /* 隐藏不需要的元素 */
  .overlay {
    display: none;
  }

  .banner-img-1 {
    /* display: none; */
    left: 30% !important;
    top: 42%;
    width: 35%;
  }

  .banner-img-2 {
    /* display: none; */
    left: 70% !important;
    top: 42%;
    width: 35%;
  }

  /* 调整image-grid大小和位置 */
  .image-grid {
    width: 70%;
    gap: 2px;
    padding: 2px;
    top: 40%;
  }

  .grid-row {
    gap: 2px;
  }

  .hero-img {
    right: auto !important;
    max-width: 100px !important;
    max-height: 100px !important;
  }

  /* 调整其他元素 */
  .first-header {
    display: block;
    font-size: 0.7em;
    top: 15%;
    left: 50%;
    text-align: center;
  }

  .first-header h1 {
    margin: 0.7em 0;
  }

  .animated-text {
    font-size: 1.2rem;
  }

  .profile {
    width: 80%;
    top: 65%;
    left: 10%;
    font-size: 1em;
  }
}

/* 500-900px */
@media (min-width: 501px) and (max-width: 900px) {

  /* 隐藏不需要的元素 */
  .overlay {
    /* display: none; */
    top: -10%;
    font-size: 0.2em;
  }

  .banner-img-1 {
    /* display: none; */
    left: 30% !important;
    top: 45%;
    width: 30%;
  }

  .banner-img-2 {
    /* display: none; */
    left: 70% !important;
    top: 45%;
    width: 30%;
  }

  /* 调整image-grid大小和位置 */
  .image-grid {
    width: 30%;
    gap: 3px;
    padding: 3px;
    top: 45%;
  }

  .grid-row {
    gap: 3px;
  }

  .hero-img {
    right: auto !important;
    max-width: 150px !important;
    max-height: 150px !important;
  }

  /* 调整其他元素 */
  .first-header {
    display: block;
    font-size: 0.8em;
    top: 15%;
    left: 50%;
    text-align: center;
  }

  .animated-text {
    font-size: 1.5rem;
  }

  .profile {
    width: 80%;
    top: 70%;
    font-size: 1.2em;
  }
}

/* 900-1300px */
@media (min-width: 901px) and (max-width: 1300px) {

  /* 调整image-grid大小和位置 */
  .image-grid {
    gap: 0.8em;
    top: 50%;
  }

  .grid-row {
    gap: 0.8em;
  }

  .hero-img {
    /* right: auto !important; */
    max-width: 200px !important;
    max-height: 200px !important;
  }

  /* 调整其他元素 */
  .animated-text {
    font-size: 2rem;
  }

  .first-header {
    font-size: 1em;
    gap: 0;
  }

  .profile {
    width: 80%;
    font-size: 1.2em;
  }
}
</style>
