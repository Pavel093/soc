<template>
  <div class="error-page">
    <div class="error-background">
      <div class="error-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
    
    <div class="error-container">
      <div class="error-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                stroke="currentColor" stroke-width="1.5"/>
          <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      
      <div class="error-content">
        <h1 class="error-code">{{ error.statusCode }}</h1>
        <h2 class="error-title" v-if="error.statusCode === 404">
          Страница не найдена
        </h2>
        <h2 class="error-title" v-else>
          Произошла ошибка
        </h2>
        <p class="error-description">
          {{ error.message || 'Запрашиваемая страница не существует или временно недоступна' }}
        </p>
        
        <div class="action-buttons">
          <NuxtLink to="/" class="btn btn-primary">
            <span>Вернуться на главную</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
          
          <button @click="$router.back()" class="btn btn-secondary">
            Назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: Object
})

if (process.client) {
  if (window.ym) {
    window.ym(104348512, 'hit', window.location.href, {
      title: 'Ошибка 404',
      referer: document.referrer
    })
  }
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.error-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.error-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 8px;
  opacity: 0.1;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 15%;
  animation: float 6s ease-in-out infinite reverse;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.error-container {
  text-align: center;
  max-width: 480px;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 
    0 8px 32px rgba(30, 64, 175, 0.08),
    0 2px 8px rgba(30, 64, 175, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.error-icon {
  margin-bottom: 24px;
  color: #1e40af;
}

.error-icon svg {
  opacity: 0.9;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-code {
  font-size: 80px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 8px 0;
  line-height: 1;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.error-description {
  font-size: 16px;
  line-height: 1.6;
  color: #6b7280;
  margin: 0 0 32px 0;
  max-width: 320px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  border: none;
  cursor: pointer;
  line-height: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

.btn-secondary {
  background: rgba(30, 64, 175, 0.08);
  color: #1e40af;
  border: 1px solid rgba(30, 64, 175, 0.2);
}

.btn-secondary:hover {
  background: rgba(30, 64, 175, 0.12);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .error-container {
    padding: 32px 24px;
    margin: 0 16px;
  }
  
  .error-code {
    font-size: 64px;
  }
  
  .error-title {
    font-size: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    justify-content: center;
  }
}
</style>