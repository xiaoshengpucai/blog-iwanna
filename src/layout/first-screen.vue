<template>
  <div class="first-screen">
    <div class="image-container">
      <img src="https://i.postimg.cc/ZngsqqxC/4.webp" alt="Fullscreen image" class="fullscreen-img" />
    </div>
    <div class="overlay">
      <div class="projects">
        <div class="projects-header">
          <p>learning phase</p>
          <p>learning Projects</p>
        </div>
      </div>
      <div class="locations">
        <div class="locations-header">
          <p>learning goals</p>
        </div>
      </div>
    </div>

    <div class="first-header">
      <h1>hello 朋友!</h1>
      <h2>一切开始皆缘自“hello word”.</h2>
    </div>
    <div class="image-grid">
      <!-- 使用v-for循环渲染图片网格 -->
      <div v-for="(row, rowIndex) in getGridImages" :key="`row-${rowIndex}`" class="grid-row">
        <div v-for="image in row" :key="image.id" class="img" :class="{ 'hero-img': image.isHero }">
          <img :src="image.isHero ? image.setUrl : image.url" :alt="`Image ${image.id}`" />
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
      <img src="https://i.postimg.cc/y6rbjf4y/9.webp" alt="" />
    </div>
    <div class="banner-img banner-img-2">
      <img src="https://i.postimg.cc/D0DpzzP2/image.webp" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import { SplitText } from "gsap/SplitText";
import { onMounted, ref, nextTick, computed } from "vue"; // 新增nextTick确保DOM加载完成
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
const getGridImages = computed(() => {
  const grid: ImageData[][] = [];
  console.log(images,getRandomImageSet());
  
  selectedImages = getRandomImageSet().slice(0, 9).map((img) => ({
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

onMounted(async () => {
  // 响应式监听窗口大小变化
  const handleResize = () => {
    isSmallScreen.value = window.innerWidth < 500;
  };

  window.addEventListener("resize", handleResize);
  handleResize(); // 初始化

  // 加载图片数据
  // await loadImages();

  // 确保DOM完全加载后再初始化所有功能
  await nextTick();

  initImageElements();
  initializeDynamicContent();
  initFullscreenImageAnimation();
  const heroTimeline = createAnimationTimelines();
  initFirstScreenScrollAnimation();
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

  const HeaderSplit = SplitText.create(".first-header", {
    type: "chars",
    charsClass: "animated-text",
  });
  HeaderSplit.chars.forEach((item) => {
    gsap.set(item, {
      opacity: 0,
      y: 100,
      rotate: -20,
      color: getRandomHexColor(),
      textShadow: `.2em .2em .2em ${getRandomHexColor()}`,
    });
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
      }
      ,
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
  return [...images].sort(() => Math.random() - 0.5).slice(0, 9)
};
function startImageRotation() {
  for (let cycle = 0; cycle < 20; cycle++) {
    gsap.delayedCall(cycle * 0.15, () => {
      const randomImages = getRandomImageSet().map((img) => img.setUrl); // 使用正确的函数获取随机图片URLs
      girdImages.forEach((img, i) => {
        const imgEl = (img as HTMLElement).querySelector("img") as HTMLImageElement;
        if (imgEl) {
          if (cycle === 19 && img === heroImage) {
            // 最后一帧特殊处理hero图片
            const randomImage = selectedImages.find((item) => item.isHero);
            if (randomImage) {
              imgEl.src = randomImage.url;
            }
          } else if (i < randomImages.length) {
            imgEl.src = randomImages[i];
          }
        }
      });
    });
  }
}

// 第一屏滚动动画（随滚动向上移动并淡出）
function initFirstScreenScrollAnimation() {
  const fullscreenImg = document.querySelector(".first-screen");
  if (!fullscreenImg) return;

  window.addEventListener("scroll", () => {
    if (!animationComplete.value) return;

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
      scale: getScaleValue() + Math.min((scrollY / (halfViewpotHeight * 2)), 4),
      opacity: 1 - Math.min(scrollY / halfViewpotHeight, 1),
    });

    // 设置头部的移动
    gsap.set(".first-header", {
      y: -scrollY,
    });
  });
}

defineExpose({
  animationComplete,
});
</script>

<style scoped>
/* 第一屏样式：固定在视口，动画结束后随滚动移动 */
.first-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-width: 400px;
  height: 100svh;
  z-index: 2;
}

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

.first-header>* {
  font-family: "Brush Script MT", cursive;
  font-weight: 600;
  text-shadow: 0.2rem 0.2rem 0.1rem #4f4f4f;
  text-transform: uppercase;
  letter-spacing: 5px;
}

.first-header h1 {
  min-width: 350px;
  text-align: center;
}

.first-header h2 {
  min-width: 580px;
  white-space: nowrap;
  /* 禁止换行 */
  overflow: hidden;
  /* 隐藏溢出内容 */
  text-overflow: ellipsis;
  /* 溢出部分显示省略号 */
}

nav {
  display: flex;
  /* background-color: red; */
  width: 80vw;
  height: 6svh;
  justify-content: space-between;
  position: fixed;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100svh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2em;
  z-index: 2;
}

.projects,
.locations {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: "Durk", sans-serif;
  font-weight: 500;
  margin: 30px;
}

.locations {
  width: 20%;
  text-align: left;
}

.locations-header,
.projects-header {
  opacity: 0;
  display: flex;
  gap: 1em;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 15px 0;
  justify-content: space-between;
}

.projects-header>*,
.locations-header>* {
  text-align: center;
  font-family: "Durk", sans-serif;
  font-weight: 500;
  font-style: italic;
  text-transform: uppercase;
}

/* 图片容器样式 */
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  backdrop-filter: blur(10px);
  opacity: .5;
  z-index: -1;
}

.fullscreen-img {
  width: 100%;
  height: 80%;
  border-radius: 2%;
  object-fit: cover;
  will-change: transform;
  border: none;
  filter: saturate(0.5);

}

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

/* 网格图片样式 */
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

.img {
  position: relative;
  flex: 1;
  aspect-ratio: 1;
  overflow: hidden;
}

.img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-img {
  position: absolute;
  top: 50%;
  transform: scale(0) translate(-50%, -50%);
  width: 20%;
  aspect-ratio: 4/5;
  z-index: 1;
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
    margin: .7em 0;
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
    font-size: .2em;
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
  .imae-grid {
    /* width: 30%; */
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
