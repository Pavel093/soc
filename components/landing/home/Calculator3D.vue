<template>
  <div class="calculator-3d-container" :class="{ 'mobile-size': isMobile }">
    <div class="calculator-3d" :style="calcStyle">
      <div class="display"></div>
      <div class="buttons">
        <div class="button-row" v-for="(row, rowIndex) in 3" :key="row">
          <div 
            class="button" 
            :class="`btn-color-${rowIndex * 3 + btn}`"
            v-for="btn in 3" 
            :key="btn"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const rotateX = ref(13)
const rotateY = ref(-13)
const isMobile = ref(false)

const calcStyle = computed(() => ({
  transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`
}))

let frameId
const startTime = performance.now()

function animate(time) {
  const t = (time - startTime) / 1000
  rotateX.value = 13 + Math.sin(t * 0.85) * 7
  rotateY.value = -13 + Math.cos(t * 0.7) * 7.5
  frameId = requestAnimationFrame(animate)
}

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  frameId = requestAnimationFrame(animate)
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.calculator-3d-container {
  perspective: 1200px;
  width: 320px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.calculator-3d {
  width: 240px;
  height: 340px;
  border-radius: 24px;
  background: linear-gradient(135deg, #f9fafb 68%, #eaf3fb 100%);
  box-shadow:
    0 12px 32px 0 rgba(110, 140, 210, 0.09),
    0 1.5px 8px 0 rgba(180,200,235, 0.065),
    0 0.5px 1.5px 0 rgba(160,180,220, 0.042);
  position: relative;
  display: flex;
  flex-direction: column;
  transition: transform 0.6s cubic-bezier(.4,2,.5,1);
}

.display {
  margin: 28px 24px 20px;
  height: 56px;
  border-radius: 13px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  box-shadow:
    0 2px 8px 0 rgba(0, 0, 0, 0.15),
    inset 0 1px 2px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid #475569;
}

.buttons {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24px 24px;
  gap: 18px;
}

.button-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

.button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow:
    0 3px 8px 0 rgba(0, 0, 0, 0.15),
    inset 0 1px 3px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .calculator-3d-container {
    width: 180px;
    height: 240px;
    perspective: 800px;
  }
  
  .calculator-3d {
    width: 140px;
    height: 200px;
    border-radius: 16px;
  }
  
  .display {
    margin: 16px 14px 12px;
    height: 32px;
    border-radius: 8px;
  }
  
  .buttons {
    padding: 0 14px 14px;
    gap: 10px;
  }
  
  .button-row {
    gap: 10px;
  }
  
  .button {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  .calculator-3d-container {
    width: 140px;
    height: 180px;
    perspective: 600px;
  }
  
  .calculator-3d {
    width: 110px;
    height: 155px;
    border-radius: 12px;
  }
  
  .display {
    margin: 12px 10px 8px;
    height: 24px;
    border-radius: 6px;
  }
  
  .buttons {
    padding: 0 10px 10px;
    gap: 8px;
  }
  
  .button-row {
    gap: 8px;
  }
  
  .button {
    width: 18px;
    height: 18px;
  }
}

/* Цветовая схема кнопок */
.btn-color-1, .btn-color-2, .btn-color-3,
.btn-color-4, .btn-color-5, .btn-color-6,
.btn-color-7, .btn-color-8, .btn-color-9 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-color-2, .btn-color-5, .btn-color-8 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-color-3, .btn-color-6, .btn-color-9 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.btn-color-5 {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow:
      0 3px 8px 0 rgba(250, 112, 154, 0.15),
      inset 0 1px 3px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow:
      0 3px 12px 0 rgba(250, 112, 154, 0.3),
      inset 0 1px 3px 0 rgba(255, 255, 255, 0.4);
  }
}

/* Отключаем hover эффекты на мобильных */
@media (hover: none) and (pointer: coarse) {
  .button:hover {
    transform: none;
    box-shadow:
      0 3px 8px 0 rgba(0, 0, 0, 0.15),
      inset 0 1px 3px 0 rgba(255, 255, 255, 0.3);
  }
}
</style>