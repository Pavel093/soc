<template>
  <section class="hero">
    <!-- Анимированный фон с градиентами -->
    <div class="hero__background">
      <div class="hero__gradient hero__gradient--1"></div>
      <div class="hero__gradient hero__gradient--2"></div>
      <div class="hero__gradient hero__gradient--3"></div>
      <div class="hero__noise"></div>
    </div>
    
    <!-- Градиентный переход снизу -->
    <div class="hero__gradient-overlay"></div>
    
    <!-- Декоративные элементы -->
    <div class="hero__decoration">
      <div class="hero__circle hero__circle--1"></div>
      <div class="hero__circle hero__circle--2"></div>
      <div class="hero__circle hero__circle--3"></div>
    </div>
    
    <!-- Основной контент -->
    <div class="hero__container">
      <div class="hero__content">
        <!-- Бейдж -->
        <div class="hero__badge">
          <span class="hero__badge-text">Официальный расчет</span>
        </div>
        
        <!-- Заголовок -->
        <h1 class="hero__title">
          <span class="hero__title-line">Калькулятор</span>
          <span class="hero__title-accent">единого пособия</span>
          <span class="hero__title-line">для семей с детьми</span>
          <span class="hero__title-accent">и беременных</span>
        </h1>
        
        <!-- Описание -->
        <p class="hero__description">
          Рассчитайте все выплаты за 2 минуты. Точный расчет онлайн — 
          <span class="hero__description-accent">бесплатно и без регистрации.</span>
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
          <li class="hero__feature">
            <span class="hero__feature-icon">✓</span>
            <span class="hero__feature-text">Подробная расшифровка</span>
          </li>
        </ul>
        
        <!-- Кнопка CTA -->
        <div class="hero__actions">
          <a href="#calculator" class="hero__button">
            <span class="hero__button-text">Рассчитать пособие</span>
            <span class="hero__button-icon">→</span>
          </a>
          
          <p class="hero__note">
            Уже помогли <span class="hero__note-accent">12 843 семьям</span>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Scroll indicator -->
    <div class="hero__scroll-indicator">
      <span class="hero__scroll-text">Листайте вниз</span>
      <div class="hero__scroll-arrow"></div>
    </div>
  </section>
</template>

<script setup>
// Логика компонента
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 100dvh;
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
    filter: blur(60px);
    opacity: 0.7;
    animation: float 20s infinite ease-in-out;
    
    &--1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(34, 196, 255, 0.15) 0%, transparent 70%);
      top: -200px;
      right: -100px;
      animation-delay: 0s;
    }
    
    &--2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(255, 72, 182, 0.1) 0%, transparent 70%);
      bottom: -150px;
      left: -100px;
      animation-delay: -7s;
    }
    
    &--3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(108, 75, 255, 0.1) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -14s;
    }
  }

  &__noise {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  // Градиентный переход снизу
  &__gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(248, 249, 251, 0.1) 20%,
      rgba(248, 249, 251, 0.3) 40%,
      rgba(248, 249, 251, 0.6) 60%,
      rgba(248, 249, 251, 0.8) 80%,
      #f5f7fa 100%
    );
    pointer-events: none;
    z-index: 5;
  }

  // Декоративные элементы
  &__decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  &__circle {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(23, 117, 246, 0.1);
    
    &--1 {
      width: 80px;
      height: 80px;
      top: 20%;
      right: 15%;
      animation: pulse 4s infinite ease-in-out;
    }
    
    &--2 {
      width: 40px;
      height: 40px;
      bottom: 30%;
      left: 10%;
      animation: pulse 3s infinite ease-in-out 1s;
    }
    
    &--3 {
      width: 60px;
      height: 60px;
      top: 60%;
      right: 20%;
      animation: pulse 5s infinite ease-in-out 2s;
    }
  }

  // Контейнер для правильного выравнивания
  &__container {
    position: relative;
    z-index: 10;
    width: 100%;
    padding: 0 20px;
  }

  // Основной контент
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  // Бейдж
  &__badge {
    display: inline-flex;
    align-items: center;
    background: rgba(23, 117, 246, 0.1);
    border: 1px solid rgba(23, 117, 246, 0.2);
    border-radius: 50px;
    padding: 8px 16px;
    margin-bottom: 30px;
    
    &-text {
      font-size: 14px;
      font-weight: 500;
      color: #1775F6;
      letter-spacing: 0.5px;
    }
  }

  // Заголовок
  &__title {
    font-size: clamp(32px, 5vw, 60px);
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 clamp(20px, 3vw, 30px);
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
        bottom: 5px;
        left: 0;
        width: 100%;
        height: 8px;
        background: rgba(23, 117, 246, 0.15);
        z-index: -1;
        border-radius: 4px;
      }
    }
  }

  // Описание
  &__description {
    font-size: clamp(18px, 2.5vw, 24px);
    line-height: 1.4;
    color: #475569;
    margin: 0 0 clamp(25px, 3vw, 35px);
    max-width: 700px;
    
    &-accent {
      font-weight: 600;
      color: #0f172a;
    }
  }

  // Преимущества
  &__features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    margin: 0 0 clamp(30px, 4vw, 45px);
    padding: 0;
    list-style: none;
  }

  &__feature {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 50px;
    padding: 10px 18px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  &__feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: #10b981;
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
    margin-right: 8px;
  }

  &__feature-text {
    font-size: 15px;
    font-weight: 500;
    color: #475569;
  }

  // Кнопка и действия
  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: #1775F6;
    color: white;
    border: none;
    padding: 18px 32px;
    font-size: clamp(18px, 2.5vw, 20px);
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    box-shadow: 0 4px 14px 0 rgba(23, 117, 246, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(23, 117, 246, 0.4);
      background: #0d6efd;
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &-icon {
      font-size: 20px;
      transition: transform 0.3s ease;
    }
    
    &:hover &-icon {
      transform: translateX(3px);
    }
  }

  &__note {
    margin: 0;
    font-size: 14px;
    color: #64748b;
    
    &-accent {
      font-weight: 600;
      color: #1775F6;
    }
  }

  // Scroll indicator
  &__scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 10;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 1;
    }
  }

  &__scroll-text {
    font-size: 14px;
    color: #64748b;
    letter-spacing: 0.5px;
  }

  &__scroll-arrow {
    width: 20px;
    height: 20px;
    border-right: 2px solid #64748b;
    border-bottom: 2px solid #64748b;
    transform: rotate(45deg);
    animation: bounce 2s infinite;
  }

  // Анимации
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -30px) scale(1.05);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.95);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: rotate(45deg) translateY(0);
    }
    40% {
      transform: rotate(45deg) translateY(-5px);
    }
    60% {
      transform: rotate(45deg) translateY(-3px);
    }
  }

  // Адаптивность
  // Планшеты (landscape)
  @media (max-width: 1024px) and (orientation: landscape) {
    min-height: 100vh;
    padding: 60px 0;
    
    &__gradient-overlay {
      height: 25%;
    }
  }

  // Планшеты
  @media (max-width: 768px) {
    padding-top: 60px;
    
    &__container {
      padding: 0 16px;
    }

    &__gradient-overlay {
      height: 20%;
    }
    
    &__features {
      flex-direction: column;
      align-items: center;
    }
    
    &__feature {
      width: fit-content;
    }
  }

  @media (max-width: 780px) {
    min-height: 100vh !important;
  }

  // Мобильные устройства
  @media (max-width: 480px) {
    padding-top: 40px;
    min-height: 100vh !important;
    
    &__container {
      padding: 0 12px;
    }

    &__gradient-overlay {
      height: 150px;
    }
    
    &__content {
      padding: 20px 0;
    }
    
    &__title {
      font-size: 36px;
      line-height: 1.1;
      margin-bottom: 20px;
    }
    
    &__description {
      font-size: 17px;
      line-height: 1.4;
      margin-bottom: 25px;
      padding: 0 10px;
    }
    
    &__button {
      width: calc(100% - 24px);
      max-width: none;
      padding: 16px 24px;
      font-size: 18px;
      border-radius: 10px;
      justify-content: center;
    }
    
    &__note {
      font-size: 13px;
    }

    &__gradient-overlay {
      height: 120px;
    }
    
    &__circle {
      display: none;
    }
  }

  // Очень маленькие экраны
  @media (max-width: 360px) {
    &__title {
      font-size: 32px;
    }
    
    &__description {
      font-size: 16px;
    }
    
    &__button {
      font-size: 16px;
      padding: 14px 20px;
    }

    &__gradient-overlay {
      height: 100px;
    }
  }

  @media (min-height: 900px) {
    &__content {
      padding: 60px 20px;
    }
  }

  // Очень маленькая высота (landscape на телефоне)
  @media (max-height: 500px) and (orientation: landscape) {
    min-height: auto;
    padding: 40px 0;
    
    &__content {
      padding: 20px 0;
    }
    
    &__title {
      margin-bottom: 15px;
    }
    
    &__description {
      margin-bottom: 20px;
    }
    
    &__features {
      margin-bottom: 20px;
    }
    
    &__note {
      margin-top: 10px;
    }

    &__gradient-overlay {
      height: 100px;
    }
    
    &__badge {
      margin-bottom: 20px;
    }
    
    &__scroll-indicator {
      display: none;
    }
  }
}
</style>