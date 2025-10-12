<template>
  <div class="share-widget">
    <!-- Основная кнопка -->
    <div class="share-button-container">
      <button 
        class="share-button"
        @click="toggleShareMenu"
        :class="{ 'share-button--active': isMenuOpen }"
      >
        <span class="share-button__icon">🔗</span>
        <span class="share-button__text">Поделиться калькулятором</span>
      </button>
    </div>

    <!-- Выпадающее меню -->
    <div v-if="isMenuOpen" class="share-menu">
      <div class="share-menu__header">
        <span class="share-menu__title">Поделиться калькулятором</span>
        <button class="share-menu__close" @click="closeMenu">×</button>
      </div>
      
      <div class="share-menu__content">
        <!-- Копирование ссылки -->
        <div class="share-option">
          <button 
            class="share-option__button"
            @click="copyLink"
            :class="{ 'share-option__button--copied': isCopied }"
          >
            <span class="share-option__icon">📋</span>
            <span class="share-option__text">
              {{ isCopied ? 'Скопировано!' : 'Скопировать ссылку' }}
            </span>
          </button>
        </div>

        <!-- Социальные сети -->
        <div class="share-social">
          <button 
            class="share-social__button share-social__button--vk"
            @click="shareToVK"
          >
            <span class="share-social__icon">VK</span>
            <span class="share-social__text">ВКонтакте</span>
          </button>
          
          <button 
            class="share-social__button share-social__button--telegram"
            @click="shareToTelegram"
          >
            <span class="share-social__icon">TG</span>
            <span class="share-social__text">Telegram</span>
          </button>
          
          <button 
            class="share-social__button share-social__button--ok"
            @click="shareToOK"
          >
            <span class="share-social__icon">OK</span>
            <span class="share-social__text">Одноклассники</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay для закрытия по клику вне меню -->
    <div v-if="isMenuOpen" class="share-overlay" @click="closeMenu"></div>

    <!-- Уведомление о копировании -->
    <transition name="fade">
      <div v-if="showNotification" class="share-notification">
        Ссылка скопирована в буфер обмена!
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMenuOpen = ref(false)
const isCopied = ref(false)
const showNotification = ref(false)

const shareText = 'Рассчитайте пособия для семей с детьми с помощью этого калькулятора'
const pageUrl = typeof window !== 'undefined' ? window.location.href : ''

// Обработчик клика вне меню
const handleClickOutside = (event) => {
  const shareWidget = document.querySelector('.share-widget')
  if (shareWidget && !shareWidget.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleShareMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(pageUrl)
    isCopied.value = true
    showNotification.value = true
    
    // Сбрасываем состояние через 2 секунды
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
    
  } catch (err) {
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea')
    textArea.value = pageUrl
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    isCopied.value = true
    showNotification.value = true
    
    setTimeout(() => {
      isCopied.value = false
      showNotification.value = false
    }, 2000)
  }
}

const shareToVK = () => {
  const url = `https://vk.com/share.php?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(shareText)}`
  window.open(url, '_blank', 'width=600,height=400')
  closeMenu()
}

const shareToTelegram = () => {
  const url = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`
  window.open(url, '_blank', 'width=600,height=400')
  closeMenu()
}

const shareToOK = () => {
  const url = `https://connect.ok.ru/offer?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(shareText)}`
  window.open(url, '_blank', 'width=600,height=400')
  closeMenu()
}
</script>

<style lang="scss" scoped>
.share-widget {
  position: relative;
  display: block;
  width: 100%;
}

// Контейнер для центрирования кнопки
.share-button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 20px 0;
}

// Основная кнопка
.share-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(23, 117, 246, 0.1);
  border: 1px solid rgba(23, 117, 246, 0.2);
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: #1775F6;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(23, 117, 246, 0.15);
    border-color: rgba(23, 117, 246, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(23, 117, 246, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &--active {
    background: rgba(23, 117, 246, 0.2);
    border-color: rgba(23, 117, 246, 0.4);
  }
  
  &__icon {
    font-size: 16px;
  }
  
  &__text {
    white-space: nowrap;
  }
}

// Overlay для закрытия меню
.share-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 998;
}

// Выпадающее меню
.share-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 999;
  min-width: 300px;
  animation: slideDown 0.2s ease;
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
  }
  
  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }
  
  &__close {
    background: none;
    border: none;
    font-size: 20px;
    color: #64748b;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #0f172a;
    }
  }
  
  &__content {
    padding: 16px 20px 20px;
  }
}

// Опция копирования
.share-option {
  margin-bottom: 16px;
  
  &__button {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    color: #475569;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    
    &--copied {
      background: #f0f9ff;
      border-color: #bae6fd;
      color: #0369a1;
    }
  }
  
  &__icon {
    font-size: 16px;
  }
  
  &__text {
    font-weight: 500;
  }
}

// Социальные сети
.share-social {
  display: flex;
  gap: 8px;
  
  &__button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    &--vk {
      &:hover {
        background: #0077FF;
        border-color: #0077FF;
        color: white;
      }
    }
    
    &--telegram {
      &:hover {
        background: #0088cc;
        border-color: #0088cc;
        color: white;
      }
    }
    
    &--ok {
      &:hover {
        background: #ee8208;
        border-color: #ee8208;
        color: white;
      }
    }
  }
  
  &__icon {
    font-size: 12px;
    font-weight: 700;
  }
  
  &__text {
    font-size: 11px;
    font-weight: 500;
  }
}

// Уведомление
.share-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
}

// Анимации
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Адаптивность
@media (max-width: 480px) {
  .share-button-container {
    margin: 16px 0;
  }
  
  .share-button {
    width: calc(100% - 32px);
    max-width: 300px;
    justify-content: center;
  }
  
  .share-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw - 40px);
    max-width: 300px;
    margin: 0;
  }
  
  .share-social {
    flex-direction: column;
    
    &__button {
      flex-direction: row;
      justify-content: center;
      padding: 12px 16px;
    }
    
    &__text {
      font-size: 12px;
    }
  }
}
</style>