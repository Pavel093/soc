<template>
  <div class="calculator-actions" :class="{ 'mobile-hidden': !isCalculatorInView && isMobile }">
    <div class="actions-container">
      <button class="action-btn share-btn" @click="handleShare" title="Поделиться калькулятором">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24919 15.0227 5.37057L7.08259 9.84029C6.54303 9.32015 5.80863 9 5 9C3.34315 9 2 10.3431 2 12C2 13.6569 3.34315 15 5 15C5.80863 15 6.54303 14.6799 7.08259 14.1597L15.0227 18.6294C15.0077 18.7508 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 19.1255 15.0077 19.2492 15.0227 19.3706L7.08259 14.9009C6.54303 15.421 5.80863 15.7411 5 15.7411C3.34315 15.7411 2 14.398 2 12.7411C2 11.0843 3.34315 9.74115 5 9.74115C5.80863 9.74115 6.54303 10.0613 7.08259 10.5814L15.0227 6.11167C15.0077 5.99029 15 5.86658 15 5.74115C15 5.61572 15.0077 5.49201 15.0227 5.37063L7.08259 0.9009C6.54303 1.42104 5.80863 1.74115 5 1.74115C3.34315 1.74115 2 3.0843 2 4.74115C2 6.398 3.34315 7.74115 5 7.74115C5.80863 7.74115 6.54303 7.42104 7.08259 6.9009L15.0227 11.3706C15.0077 11.492 15 11.6157 15 11.7411C15 11.8666 15.0077 11.9903 15.0227 12.1117L7.08259 16.5814C6.54303 16.0613 5.80863 15.7411 5 15.7411Z" fill="currentColor"/>
        </svg>
      </button>

      <button class="action-btn report-btn" @click="handleReport" title="Сообщить об ошибке">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 9V13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isCalculatorInView: {
    type: Boolean,
    default: true
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Калькулятор единого пособия',
      text: 'Рассчитайте размер единого пособия на детей и беременных',
      url: window.location.href
    }).catch(error => {
      fallbackShare()
    })
  } else {
    fallbackShare()
  }
}

const fallbackShare = () => {
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      // Минималистичное уведомление вместо alert
      showToast('Ссылка скопирована')
    })
    .catch(err => {
      prompt('Скопируйте ссылку:', window.location.href)
    })
}

const handleReport = () => {
  const email = 'support@example.com'
  const subject = 'Ошибка в калькуляторе пособия'
  const body = `Ошибка:\n\nСтраница: ${window.location.href}`
  
  window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
}

const showToast = (message) => {
  // Простая реализация toast-уведомления
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `
  document.body.appendChild(toast)
  
  setTimeout(() => toast.style.opacity = '1', 10)
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 2000)
}
</script>

<style scoped lang="scss">
.calculator-actions {
  position: sticky;
  top: 0;
  z-index: 90;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  
  &.mobile-hidden {
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
  }
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748B;
  
  &:hover {
    background: #F1F5F9;
    border-color: #CBD5E1;
    color: #475569;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  
  &:hover svg {
    opacity: 1;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .calculator-actions {
    padding: 0.375rem 0;
    margin-bottom: 0.75rem;
  }
  
  .actions-container {
    padding: 0 0.75rem;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
}

// Плавные переходы
.calculator-actions {
  transition: all 0.3s ease;
}
</style>