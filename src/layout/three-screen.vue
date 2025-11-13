<!-- <template>
    <div class="hyperspeed-container">
        <Hyperspeed :effect-options="effectOptions" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Hyperspeed from '../components/Hyperspeed.vue'
import { hyperspeedPresets } from '../utils/HyperspeedPresets'
const customArray: Array<keyof typeof hyperspeedPresets> = ["one", "two", "three", "four", "five","six"]
// Use a preset or create custom options
const effectOptions = ref(hyperspeedPresets.two)
onMounted(() => {
    const randomKey = customArray[Math.floor(Math.random() * customArray.length)];
    effectOptions.value = hyperspeedPresets[randomKey]; // 动态属性访问
})
// Or create your own custom configuration
const customOptions: Record<string, any> = ref({
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0xffffff,
        brokenLines: 0xffffff,
        leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
        rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
        sticks: 0x03b3c3,
    },
})
</script>

<style scoped>
.hyperspeed-container {
    width: 100vw;
    height: 100vh;
    cursor: pointer;
    position: relative;
    margin-top: auto;
}

/* 确保容器在底部 */
:deep(.hyperspeed-container-wrapper) {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* 媒体查询，确保在不同设备上的响应式行为 */
@media (max-width: 768px) {
    .hyperspeed-container {
        min-height: 60%;
    }
}

@media (max-width: 480px) {
    .hyperspeed-container {
        min-height: 50%;
    }
}
</style> -->

<template>
    <div class="three-screen">
        <div class="hyperspeed-container">
            <useHyperspeed />
        </div>
        <div class="main-container">
            <div class="title">
                <h1>My Blog</h1>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import useHyperspeed from '../components/useHyperspeed.vue';
</script>

<style scoped>
.hyperspeed-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    cursor: pointer;
    margin-top: auto;
    z-index: -1;
}

.main-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60vw;
    height: 40vw;
    background-color: #0002;
    backdrop-filter: blur(10px);
    border-radius: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.title {
    font-size: 3em;
    font-weight: bold;
    color: #fff;
}
</style>
