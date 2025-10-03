<script setup>
import { ref, onMounted } from 'vue'
import SmartCalculator from '~/components/SmartCalculator.vue'

definePageMeta({
  ssr: false
})

const isBlocked = ref(false)
const isLoading = ref(true)
const sessionId = ref('')
const errorMessage = ref('')

onMounted(async () => {
  // Генерируем ID сессии
  sessionId.value = Math.random().toString(36).substring(2) + Date.now().toString(36)
  
  // Определяем откуда встроен iframe
  let referrerDomain = 'direct'
  let pageUrl = window.location.href
  
  // Проверяем, находимся ли мы в iframe
  const isInIframe = window !== window.parent
  
  if (isInIframe && document.referrer) {
    try {
      const url = new URL(document.referrer)
      referrerDomain = url.hostname
      pageUrl = document.referrer
      console.log('📍 Встроен с домена:', referrerDomain)
    } catch (e) {
      console.log('⚠️ Не удалось определить домен:', e)
    }
  } else {
    // Если открыто напрямую
    referrerDomain = window.location.hostname || 'localhost'
    console.log('📍 Открыто напрямую на:', referrerDomain)
  }
  
  console.log('🚀 Отправляем данные подключения:', {
    domain: referrerDomain,
    pageUrl: pageUrl,
    sessionId: sessionId.value
  })
  
  try {
    // Отправляем информацию о подключении
    const response = await $fetch('/api/embed/connect', {
      method: 'POST',
      body: {
        domain: referrerDomain,
        pageUrl: pageUrl,
        userAgent: navigator.userAgent,
        sessionId: sessionId.value
      }
    })
    
    console.log('✅ Ответ от сервера:', response)
    
    if (response.blocked) {
      isBlocked.value = true
    } else {
      isLoading.value = false
      
      // Если в iframe - настраиваем взаимодействие
      if (isInIframe) {
        document.body.style.margin = '0'
        document.body.style.padding = '0'
        
        // Отправляем высоту родителю
        const sendHeight = () => {
          const height = document.documentElement.scrollHeight
          window.parent.postMessage({
            type: 'resize',
            height: height
          }, '*')
        }
        
        // Следим за изменением размера
        const observer = new ResizeObserver(sendHeight)
        observer.observe(document.body)
        sendHeight()
      }
    }
  } catch (error) {
    console.error('❌ Ошибка подключения:', error)
    errorMessage.value = error.data?.message || error.message || 'Ошибка подключения'
    isLoading.value = false
  }
})
</script>

<template>
  <div class="embed-wrapper">
    <!-- Если есть ошибка -->
    <div v-if="errorMessage" class="error-message">
      <div class="error-content">
        <h2>Ошибка</h2>
        <p>{{ errorMessage }}</p>
        <small>Проверьте консоль для деталей</small>
      </div>
    </div>
    
    <!-- Если домен заблокирован -->
    <div v-else-if="isBlocked" class="blocked-message">
      <div class="blocked-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/>
          <path d="M12 8v4m0 4h.01" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <h2>Доступ ограничен</h2>
        <p>Данный домен был заблокирован администратором.</p>
        <small>По вопросам разблокировки обратитесь на support@example.com</small>
      </div>
    </div>
    
    <!-- Загрузка -->
    <div v-else-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка калькулятора...</p>
    </div>
    
    <!-- Калькулятор -->
    <div v-else class="calculator-container">
      <SmartCalculator :embedded="true" />
      
      <!-- Небольшая ссылка на источник -->
      <!-- <div class="powered-by">
        <a href="https://your-site.ru" target="_blank" rel="noopener">
          Калькулятор от YourSite
        </a>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
/* Стили остаются те же */
.embed-wrapper {
  min-height: 400px;
  background: white;
}

.error-message,
.blocked-message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  background: #fef2f2;
}

.error-content,
.blocked-content {
  text-align: center;
  max-width: 400px;
}

.error-content h2,
.blocked-content h2 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
}

.error-content p,
.blocked-content p {
  color: #7f1d1d;
  margin: 0 0 1rem 0;
}

.error-content small,
.blocked-content small {
  color: #991b1b;
  font-size: 0.875rem;
}

.blocked-content svg {
  margin: 0 auto 1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.calculator-container {
  width: 100%;
}

.powered-by {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.powered-by a {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
}

.powered-by a:hover {
  color: #3b82f6;
}
</style>