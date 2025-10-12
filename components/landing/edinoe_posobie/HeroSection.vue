<template>
  <section class="hero">
    <!-- Упрощенный фон -->
    <div class="hero__background">
      <div class="hero__gradient hero__gradient--1"></div>
      <div class="hero__gradient hero__gradient--2"></div>
    </div>
    
    <!-- Градиентный переход снизу -->
    <div class="hero__gradient-overlay"></div>
    
    <!-- Основной контент -->
    <div class="hero__container">
      <div class="hero__content">
        <!-- Заголовок -->
        <h1 class="hero__title">
          <span class="hero__title-line">Калькулятор</span>
          <span class="hero__title-accent">единого пособия</span>
        </h1>
        
        <!-- Описание -->
        <p class="hero__description">
          Рассчитайте все выплаты за 2 минуты
        </p>
        
        <!-- Преимущества -->
        <ul class="hero__features">
          <li class="hero__feature">
            <span class="hero__feature-icon">✓</span>
            <span class="hero__feature-text">Актуальные правила 2025 года</span>
          </li>
          <li class="hero__feature">
            <span class="hero__feature-icon">✓</span>
            <span class="hero__feature-text">Учет всех критериев</span>
          </li>
        </ul>
        
        <!-- Кнопка CTA -->
        <div class="hero__actions">
          <a href="#calculator" class="hero__button">
            <span class="hero__button-text">Рассчитать пособие</span>
            <span class="hero__button-icon">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Логика компонента
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

  // Анимированный фон
  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  &__gradient {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.5;
    animation: float 15s infinite ease-in-out;
    
    &--1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(34, 196, 255, 0.1) 0%, transparent 70%);
      top: -100px;
      right: -50px;
      animation-delay: 0s;
    }
    
    &--2 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 72, 182, 0.05) 0%, transparent 70%);
      bottom: -100px;
      left: -50px;
      animation-delay: -5s;
    }
  }

  // Градиентный переход снизу
  &__gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(248, 249, 251, 0.3) 30%,
      rgba(248, 249, 251, 0.7) 60%,
      #f5f7fa 100%
    );
    pointer-events: none;
    z-index: 5;
  }

  // Контейнер для правильного выравнивания
  &__container {
    position: relative;
    z-index: 10;
    width: 100%;
    padding: 40px 20px;
  }

  // Основной контент
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  // Заголовок
  &__title {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 clamp(15px, 2vw, 20px);
    color: #0f172a;
    
    &-line {
      display: block;
    }
    
    &-accent {
      color: #1775F6;
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 3px;
        left: 0;
        width: 100%;
        height: 6px;
        background: rgba(23, 117, 246, 0.15);
        z-index: -1;
        border-radius: 3px;
      }
    }
  }

  // Описание
  &__description {
    font-size: clamp(16px, 2vw, 18px);
    line-height: 1.4;
    color: #475569;
    margin: 0 0 clamp(20px, 2.5vw, 25px);
    max-width: 500px;
  }

  // Преимущества
  &__features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin: 0 0 clamp(25px, 3vw, 30px);
    padding: 0;
    list-style: none;
  }

  &__feature {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 20px;
    padding: 8px 16px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
  }

  &__feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: #10b981;
    color: white;
    border-radius: 50%;
    font-size: 10px;
    font-weight: bold;
    margin-right: 6px;
  }

  &__feature-text {
    font-size: 14px;
    font-weight: 500;
    color: #475569;
  }

  // Кнопка и действия
  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #1775F6;
    color: white;
    border: none;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    box-shadow: 0 4px 12px 0 rgba(23, 117, 246, 0.3);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(23, 117, 246, 0.4);
      background: #0d6efd;
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &-icon {
      font-size: 16px;
      transition: transform 0.3s ease;
    }
    
    &:hover &-icon {
      transform: translateX(2px);
    }
  }

  // Анимации
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(20px, -20px) scale(1.03);
    }
    66% {
      transform: translate(-15px, 15px) scale(0.97);
    }
  }

  // Адаптивность
  @media (max-width: 768px) {
    min-height: 60vh;
    
    &__container {
      padding: 30px 16px;
    }

    &__gradient-overlay {
      height: 30%;
    }
    
    &__features {
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    
    &__feature {
      width: fit-content;
    }
  }

  @media (max-width: 480px) {
    min-height: 50vh;
    
    &__container {
      padding: 20px 12px;
    }

    &__gradient-overlay {
      height: 100px;
    }
    
    &__title {
      font-size: 24px;
      margin-bottom: 12px;
    }
    
    &__description {
      font-size: 15px;
      margin-bottom: 18px;
    }
    
    &__button {
      padding: 12px 20px;
      font-size: 15px;
      border-radius: 8px;
    }
    
    &__feature {
      padding: 6px 12px;
    }
    
    &__feature-text {
      font-size: 13px;
    }
  }

  // Landscape на телефоне
  @media (max-height: 500px) and (orientation: landscape) {
    min-height: auto;
    padding: 20px 0;
    
    &__container {
      padding: 20px 16px;
    }
    
    &__title {
      margin-bottom: 10px;
    }
    
    &__description {
      margin-bottom: 15px;
    }
    
    &__features {
      margin-bottom: 15px;
    }
  }
}
</style>