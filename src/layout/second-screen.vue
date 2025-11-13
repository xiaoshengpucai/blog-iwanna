<template>
  <div class="next-section">
    <section class="spotlight">
      <div class="header header1">
        <h1>This is the road I have traveled</h1>
      </div>

      <div class="spotlight-images">
        <div v-for="(row, rowIndex) in imageRows" :key="rowIndex" class="row">
          <div v-for="(image, imgIndex) in row" :key="`${rowIndex}-${imgIndex}`" class="simg">
            <img v-if="image" :src="image" :alt="`Spotlight image ${rowIndex}-${imgIndex}`" />
          </div>
        </div>
      </div>
      <div class="mask-container-second">
        <div class="mask-img">
          <img src="https://youke1.picui.cn/s1/2025/11/13/6914e795a672b.png" alt="" />
        </div>
        <div class="header">
          <h1>攀登的过程 比站在顶峰更彭拜</h1>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { onMounted, ref } from "vue";
import { imagesDataToSecondScreen } from "../assets/data/Imagesdata";

import Lenis from "lenis";
// 为模板渲染提供的图片行数据引用
const imageRows = ref(imagesDataToSecondScreen.rows);


gsap.registerPlugin(ScrollTrigger, SplitText);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
onMounted(() => {
  const spotlightImages = document.querySelector(
    ".spotlight-images"
  ) as HTMLElement;
  const maskContainer = document.querySelector(
    ".mask-container-second"
  ) as HTMLElement;
  const maskImage = document.querySelector(".mask-img") as HTMLElement;
  const maskHeader = document.querySelector(
    ".mask-container-second .header h1"
  ) as HTMLElement;
  const spotlightContainerHeight = spotlightImages.offsetHeight;
  const viewportHeight = window.innerHeight;
  const initialOffset = spotlightContainerHeight * 0.05;
  const tolaMovement =
    spotlightContainerHeight + initialOffset + viewportHeight;
  console.log(initialOffset, initialOffset, viewportHeight, spotlightContainerHeight);

  let headerSplit: any = null;
  if (maskHeader) {
    headerSplit = SplitText.create(maskHeader, {
      type: "chars",
    });
    gsap.set(headerSplit.chars, { y: -100 });
  }
  const isphoneScreen: number = window.innerWidth < 500 ? 1.5 : 4;

  ScrollTrigger.create({
    trigger: ".spotlight",
    start: "top top",
    end: `+=${window.innerHeight * isphoneScreen}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      if (progress <= 0.5) {
        const imagesMoveProgress = progress / 0.1;
        const startY = window.innerWidth < 500 ? 100 : 5;
        const endY = -(tolaMovement / spotlightContainerHeight) * 100;
        const currentY = startY + (endY - startY) * imagesMoveProgress;
        gsap.set(spotlightImages, {
          y: `${currentY}`,
        });
      }

      if (maskContainer && maskImage) {
        if (progress >= 0.25 && progress <= 0.75) {
          const maskProgress = (progress - 0.25) / 0.5;
          const maskSize = `${maskProgress * 450}%`;
          const imageScale = 1.5 - maskProgress * 0.5;

          maskContainer.style.setProperty("-webkit-mask-size", maskSize, "important");
          maskContainer.style.setProperty("mask-size", maskSize, "important");

          gsap.set(maskImage, {
            scale: imageScale,
          });
        }
        else if (progress <= 0.25) {
          maskContainer.style.setProperty("-webkit-mask-size", "0%");
          maskContainer.style.setProperty("mask-size", "0%");
          gsap.set(maskImage, {
            scale: 1.5,
          });
        } else if (progress >= 0.75) {
          maskContainer.style.setProperty("-webkit-mask-size", "500%");
          maskContainer.style.setProperty("mask-size", "500%");
          gsap.set(maskImage, {
            scale: 1,
          });
        }
      }
      if (headerSplit && headerSplit.chars.length > 0) {
        if (progress >= 0.75 && progress <= 0.95) {
          const textProgress = (progress - 0.75) / 0.2;
          const totalWords = headerSplit.chars.length;

          headerSplit.chars.forEach((chars: any, index: number) => {
            const wordRevealProgress = index / totalWords;
            if (textProgress >= wordRevealProgress) {
              gsap.to(chars, {
                opacity: 1,
                stagger: 0.1,
                y: 0,
                duration: 0.1,
                ease: "circ.in",
                willChange: "transform, opacity",
              });
            } else {
              gsap.to(chars, {
                opacity: 0,
                stagger: 0.1,
                y: -100,
                duration: 0.1,
                ease: "circ.in",
                willChange: "transform, opacity",
              });
            }
          });
        } else if (progress < 0.75) {
          gsap.set(headerSplit.chars, { opacity: 0 });
        }
      }
    },
  });
});
</script>

<style scoped lang="scss">
@import url("https://c.webfontfree.com/c.js?f=Tofu-Condensed");

/* 第二屏样式：位于第一屏下方，占满一屏 */
.next-section {
  left: 0;
  width: 100vw;
  min-height: 100vh;
  z-index: 2;
  /* 可选：添加背景色区分区域 */
  // background-color: #fff;
  overflow-x: hidden;
}

h1 {
  text-transform: uppercase;
  font-family: "Tofu-Condensed", cursive;
  font-size: 6rem;
  font-weight: bold;
  line-height: 0.85;
  letter-spacing: -0.02rem;
  text-shadow: 0.2rem 0.4rem 0.1rem #101010, 0 0 2px #fff, -1px -1px 0 #101010,
    1px -1px 0 #101010, -1px 1px 0 #101010, 1px 1px 0 #101010;
}

nav img {
  width: 1.5rem;
}

section {
  position: relative;
  width: 100vw;
  height: 100svh;
  // background-color: #161616;
  color: #fff;
  overflow: hidden;
}

.header {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
  z-index: 2;
  min-width: calc(100% - 4rem);
}

.spotlight {
  z-index: 2;
}

.spotlight .header {
  mix-blend-mode: difference;
}

.spotlight-images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 200vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  transform: translateY(5%);
  will-change: transform;
}

.row {
  width: 100%;
  padding: 2rem;
  display: flex;
  gap: 1rem;
}

.simg {
  flex: 1;
  aspect-ratio: 5/7;
  overflow: hidden;
}

.simg img {
  opacity: 0.5;
  filter: saturate(0.5);
}

.mask-container-second {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  -webkit-mask: url(/src/assets/icons/B1.svg) no-repeat center/contain;
  mask: url(/src/assets/icons/B1.svg) no-repeat center/contain;
  -webkit-mask-size: 0%;
  mask-size: 0%;
  overflow: hidden;
  z-index: 10;
}

.mask-container-second .mask-img {
  width: 100%;
  height: 100%;
}

@media (max-width: 1000px) {
  h1 {
    font-size: 2rem;
  }

  .header {
    width: calc(100% - 4rem);
  }

  .spotlight-images {
    width: 200vw;
    left: -50vw;
  }

  .simg {
    min-width: 10vw;
  }
}

@media (max-width: 500px) {
  h1 {
    font-size: 1.5em;
  }

  .header {
    width: calc(100% - 4rem);
  }

  .spotlight-images {
    width: 250vw;
    left: -50vw;
  }
}
</style>
