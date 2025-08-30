<template>
  <header class="header" :class="{ 'post': isScrolled }">
    <div class="header__container">
      <div class="header__logo">
        <img :src="Logo" alt="logo-image">
      </div>
      
      <nav class="header__nav">
        <ul class="header__nav-list">
          <li class="header__nav-item" v-for="item in menuItems" :key="item.href">
            <a :href="item.href" class="header__nav-link">
              <component :is="item.icon" />
              {{ item.text }}
            </a>
          </li>
        </ul>
      </nav>

      <button class="header__burger" @click="toggleMenu" :class="{ 'header__burger--active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Overlay для затемнения фона -->
    <div class="header__overlay" :class="{ 'header__overlay--active': isMenuOpen }" @click="closeMenu"></div>

    <!-- Мобильное меню -->
    <div class="header__mobile-menu" :class="{ 'header__mobile-menu--open': isMenuOpen }">
      <!-- Шапка мобильного меню -->
      <div class="header__mobile-header">
        <div class="header__mobile-logo">
          <img :src="Logo" alt="logo-image">
          <span>Меню</span>
        </div>
        <button class="header__mobile-close" @click="closeMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Список пунктов меню -->
      <ul class="header__mobile-list">
        <li class="header__mobile-item" v-for="(item, index) in menuItems" :key="item.href"
            :style="{ animationDelay: `${index * 0.05}s` }">
          <a :href="item.href" class="header__mobile-link" @click="closeMenu">
            <div class="header__mobile-icon">
              <component :is="item.icon" />
            </div>
            <div class="header__mobile-content">
              <span class="header__mobile-title">{{ item.text }}</span>
              <span class="header__mobile-desc">{{ item.description }}</span>
            </div>
            <svg class="header__mobile-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import Logo from '../assets/global-image/Logo.png'

import IconHome from './icons/IconHome.vue'
import IconFaq from './icons/IconFaq.vue'
import IconCalculator from './icons/IconCalculator.vue'
import IconWidget from './icons/IconWidget.vue'

const isMenuOpen = ref(false)

const isScrolled = ref(false) 

const menuItems = ref([
  {
    href: '#main',
    text: 'На главную',
    description: 'Вернуться на главную страницу',
    icon: markRaw(IconHome)
  },
  {
    href: '#faq',
    text: 'Ответы на вопросы',
    description: 'Часто задаваемые вопросы',
    icon: markRaw(IconFaq)
  },
  {
    href: '#calculator',
    text: 'Калькуляторы',
    description: 'Расчет стоимости и сроков',
    icon: markRaw(IconCalculator)
  },
  {
    href: '#widget',
    text: 'Виджет на сайт',
    description: 'Установка виджета',
    icon: markRaw(IconWidget)
  }
])

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  // Блокируем скролл body при открытом меню
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

// Функция для обработки скролла
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50 // Добавляем класс, когда прокрутка больше 50px
}

// Навешиваем обработчик события скролла при монтировании компонента
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// Убираем обработчик при размонтировании компонента
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(10px);
  transition: background 0.3s;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  &.post{
    background-color: rgba(255, 255, 255, 0.63);
  }

  &__container {
    margin: 0 auto;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease;
    img{
        width: 35px;
    }
    &:hover {
      transform: scale(1.05);
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    @media (max-width: 768px) {
      display: none;
    }

    &-list {
      display: flex;
      align-items: center;
      gap: 30px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &-item {
      margin: 0;
    }

    &-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #000000;
      text-decoration: none;
      font-size: 18px;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;

      svg {
        width: 18px;
        height: 18px;
        transition: transform 0.3s ease;
        fill: black;
      }
      &:hover {

        svg {
          transform: translateY(-2px);
        }
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 2px;
        background: #1E88E5;
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }
    }
  }

  // Бургер меню
  &__burger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    width: 44px;
    height: 44px;
    background: #f5f5f5;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    padding: 0;
    position: relative;
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      display: flex;
    }

    &:hover {
      background: #1775F6;
      border-color: #1775F6;
      
      span {
        background: white;
      }
    }

    span {
      display: block;
      width: 20px;
      height: 2px;
      background: #333;
      border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      margin: 0 auto;
    }

    &--active {
      background: #1775F6;
      border-color: #1775F6;
      
      span {
        background: white;
        
        &:nth-child(1) {
          transform: rotate(45deg) translateY(6px);
        }

        &:nth-child(2) {
          opacity: 0;
          transform: scale(0);
        }

        &:nth-child(3) {
          transform: rotate(-45deg) translateY(-6px);
        }
      }
    }
  }

  // Overlay
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 998;
    height: 100vh;
    &--active {
      opacity: 1;
      visibility: visible;
    }
  }

  // Мобильное меню
  &__mobile-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 85%;
    max-width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 999;
    display: flex;
    flex-direction: column;

    &--open {
      right: 0;
    }
  }

  &__mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: #1775F6;
    box-shadow: 0 2px 10px rgba(23, 117, 246, 0.2);
  }

  &__mobile-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    
    img {
      width: 35px;
      height: 35px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 4px;
    }
    
    span {
      font-size: 18px;
      font-weight: 600;
      color: white;
    }
  }

  &__mobile-close {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }
  }

  &__mobile-list {
    list-style: none;
    margin: 0;
    padding: 20px;
    flex: 1;
    overflow-y: auto;
  }

  &__mobile-item {
    margin-bottom: 8px;
    opacity: 0;
    animation: slideInRight 0.5s ease forwards;
  }

  &__mobile-link {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    color: #333;
    text-decoration: none;
    background: #f8f9fa;
    border-radius: 16px;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:hover {
      background: #1775F6;
      color: white;
      transform: translateX(-5px);
      box-shadow: 0 4px 15px rgba(23, 117, 246, 0.3);

      .header__mobile-icon {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(10deg) scale(1.1);
        
        svg {
          fill: rgb(0, 0, 0);
        }
      }

      .header__mobile-arrow {
        transform: translateX(4px);
      }
    }
  }

  &__mobile-icon {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1775F6;
    border-radius: 12px;
    transition: all 0.3s ease;

    svg {
      width: 22px;
      height: 22px;
      @media (max-width: 768px) {
        fill: white;
      }      
    }
  }

  &__mobile-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__mobile-title {
    font-size: 16px;
    font-weight: 600;
    color: inherit;
  }

  &__mobile-desc {
    font-size: 12px;
    opacity: 0.7;
    color: inherit;
  }

  &__mobile-arrow {
    transition: transform 0.3s ease;
    opacity: 0.5;
  }
}

// Анимации
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>