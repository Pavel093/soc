<template>
  <!-- 1. Добавляем ref, чтобы получить доступ к DOM-элементу в скрипте -->
  <div 
    ref="containerRef" 
    class="calculator-3d-container" 
    :class="{ 'mobile-size': isMobile }"
  >
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

// --- Refs для управления состоянием ---
const rotateX = ref(15)
const rotateY = ref(-15)
const isMobile = ref(false)
const containerRef = ref(null) // Ref для корневого элемента
const startTime = ref(performance.now()) // Ref для таймера, чтобы сбрасывать его

let frameId = null // ID кадра анимации, null - если анимация остановлена
let observer = null // Экземпляр Intersection Observer

// --- Computed-свойство для стилей (без изменений) ---
const calcStyle = computed(() => ({
  transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale(1.05)`
}))

// --- Основная функция анимации (без изменений, кроме startTime.value) ---
function animate(time) {
  const t = (time - startTime.value) / 1000
  rotateX.value = 15 + Math.sin(t * 0.8) * 5
  rotateY.value = -15 + Math.cos(t * 0.6) * 5
  frameId = requestAnimationFrame(animate)
}

// --- 2. Функции для управления анимацией ---
function startAnimation() {
  if (!frameId) { // Запускаем, только если она еще не запущена
    startTime.value = performance.now() // Сбрасываем таймер для плавного старта
    frameId = requestAnimationFrame(animate)
  }
}

function stopAnimation() {
  if (frameId) { // Останавливаем, только если она запущена
    cancelAnimationFrame(frameId)
    frameId = null
  }
}

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

// --- 3. Хуки жизненного цикла с Intersection Observer ---
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // Настройка Intersection Observer
  observer = new IntersectionObserver(
    ([entry]) => {
      // Когда элемент появляется в зоне видимости - запускаем анимацию
      if (entry.isIntersecting) {
        startAnimation()
      } else {
      // Когда элемент пропадает - останавливаем
        stopAnimation()
      }
    },
    // Начинаем реагировать, когда хотя бы 10% элемента видно
    { threshold: 0.1 } 
  );

  // Начинаем следить за нашим компонентом
  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
})

onBeforeUnmount(() => {
  // Обязательная очистка, чтобы избежать утечек памяти
  stopAnimation() 
  window.removeEventListener('resize', checkMobile)
  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value)
  }
})
</script>

<style scoped>
.calculator-3d-container {
  perspective: 1400px;
  width: 340px;
  height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
  z-index: 2;
}

.calculator-3d {
  width: 260px;
  height: 360px;
  border-radius: 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow:
    0 25px 50px -12px rgba(43, 123, 246, 0.15),
    0 8px 25px -8px rgba(43, 123, 246, 0.1),
    0 2px 8px -2px rgba(43, 123, 246, 0.05),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
  position: relative;
  display: flex;
  flex-direction: column;
  transition: transform 0.6s cubic-bezier(0.4, 2, 0.5, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  /* 4. Подсказка браузеру, что свойство transform будет меняться */
  will-change: transform;
}

.display {
  margin: 32px 28px 24px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  box-shadow:
    0 4px 12px 0 rgba(0, 0, 0, 0.2),
    inset 0 1px 2px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid #475569;
  position: relative;
  overflow: hidden;
}

.display::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
}

.buttons {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 28px 28px;
  gap: 20px;
}

.button-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow:
    0 4px 12px 0 rgba(0, 0, 0, 0.15),
    inset 0 1px 3px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: leftd-container {
    width: 160px;
    height: 200px;
    perspective: 800px;
  }
  
  .calculator-3d {
    width: 130px;
    height: 170px;
    border-radius: 16px;
  }
  
  .display {
    margin: 16px 12px 12px;
    height: 32px;
    border-radius: 10px;
  }
  
  .buttons {
    padding: 0 12px 12px;
    gap: 10px;
  }
  
  .button-row {
    gap: 10px;
  }
  
  .button {
    width: 22px;
    height: 22px;
  }
}

/* Цветовая схема кнопок с #2b7bf6 */
.btn-color-1, .btn-color-4, .btn-color-7 {
  background: #2b7bf6;
}

.btn-color-2, .btn-color-5, .btn-color-8 {
  background: #1d6de3;
}

.btn-color-3, .btn-color-6, .btn-color-9 {
  background: #0f5fd1;
}

.btn-color-5 {
  animation: pulse 2s infinite;
  /* Анимация box-shadow не очень производительна, но will-change может немного помочь */
  will-change: box-shadow;
}

@keyframes pulse {
  0%, 100% {
    box-shadow:
      0 4px 12px 0 rgba(43, 123, 246, 0.3),
      inset 0 1px 3px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow:
      0 4px 20px 0 rgba(43, 123, 246, 0.5),
      inset 0 1px 3px 0 rgba(255, 255, 255, 0.4);
  }
}

/* Отключаем hover эффекты на мобильных */
@media (hover: none) and (pointer: coarse) {
  .button:hover::before {
    left: -100%;
  }
}
</style>
