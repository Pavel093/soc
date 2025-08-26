<template>
  <section class="hero">
    <!-- SVG фон -->
    <div class="hero__background">
      <svg 
        viewBox="0 0 1403 723" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g filter="url(#filter0_n_246_41)">
          <rect width="1403" height="723" fill="url(#paint0_radial_246_41)"/>
          <rect width="1403" height="723" fill="url(#paint1_radial_246_41)"/>
          <rect width="1403" height="723" fill="url(#paint2_radial_246_41)"/>
        </g>
        <defs>
          <filter id="filter0_n_246_41" x="0" y="0" width="1403" height="723" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feTurbulence type="fractalNoise" baseFrequency="1 1" stitchTiles="stitch" numOctaves="3" result="noise" seed="107" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
            <feComponentTransfer in="alphaNoise" result="coloredNoise1">
              <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
            </feComponentTransfer>
            <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
            <feFlood flood-color="rgba(255, 255, 255, 0.18)" result="color1Flood" />
            <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
            <feMerge result="effect1_noise_246_41">
              <feMergeNode in="shape" />
              <feMergeNode in="color1" />
            </feMerge>
          </filter>
          <radialGradient id="paint0_radial_246_41" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(371 434.5) rotate(31.5978) scale(387.439 298.127)">
            <stop stop-color="#22C4FF"/>
            <stop offset="1" stop-color="white" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="paint1_radial_246_41" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1045 441) rotate(140.053) scale(285.011 384.132)">
            <stop stop-color="#FF48B6"/>
            <stop offset="1" stop-color="white" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="paint2_radial_246_41" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(702 361) rotate(90) scale(332.5 448.137)">
            <stop stop-color="#6C4BFF" stop-opacity="0.85"/>
            <stop offset="1" stop-color="white" stop-opacity="0"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
    
    <!-- Градиентный переход снизу -->
    <div class="hero__gradient-overlay"></div>
    
    <!-- Основной контент -->
    <div class="hero__container">
      <div class="hero__content">
        <h1 class="hero__title">
          калькулятор <span class="hero__title-accent">единого пособия</span> для
          <span class="hero__title-accent">семей с детьми</span> и <span class="hero__title-accent">беременных</span>
        </h1>
        
        <p class="hero__description">
          Рассчитайте все выплаты за 2 минуты. Точный расчет
          <span class="hero__description-break">онлайн — бесплатно и без регистрации.</span>
        </p>
        
        <button class="hero__button" type="button">
          рассчитать
        </button>
        
        <p class="hero__note">
          Актуальные правила 2025 года
        </p>
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
  min-height: 100vh;
  min-height: 100dvh; // Динамическая высота viewport для мобильных
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #ffffff; // Базовый белый фон

  // SVG фон
  &__background {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    min-width: 1403px;
    z-index: 0;
    
    svg {
      width: 100%;
      height: 100%;
      opacity: 0.5;
    }
  }

  // Градиентный переход снизу
  &__gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%; // Занимает 30% высоты секции
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(248, 249, 251, 0) 0%,
      rgba(248, 249, 251, 0.2) 20%,
      rgba(248, 249, 251, 0.4) 40%,
      rgba(248, 249, 251, 0.6) 60%,
      rgba(248, 249, 251, 0.8) 80%,
      #f5f7fa 100%
    );
    pointer-events: none; // Чтобы не блокировать клики
    z-index: 5;
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

  &__title {
    font-size: clamp(28px, 5vw, 56px);
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 clamp(20px, 3vw, 30px);
    color: rgb(0, 0, 0);
    
    &-accent {
      color: #1775F6;
      position: relative;
      white-space: nowrap; // Предотвращаем разрыв акцентных фраз
    }
  }

  &__description {
    font-size: clamp(18px, 2.5vw, 28px);
    line-height: 1.3;
    color: #3A3A3A;
    margin: 0 0 clamp(30px, 4vw, 40px);
    max-width: 800px;
    width: 100%;
    
    &-break {
      display: block;
      margin-top: 0.2em;
    }
  }

  &__button {
    background: #1775F6;
    color: #ffffff;
    border: 2px solid #97C3FF;
    padding: clamp(16px, 2.5vw, 24px) clamp(32px, 4vw, 48px);
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 500;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: capitalize;
    min-width: 200px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(23, 117, 246, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  &__note {
    margin-top: clamp(16px, 2vw, 20px);
    font-size: clamp(16px, 2vw, 20px);
    color: #3A3A3A;
    opacity: 0.8;
  }

  // Планшеты (landscape)
  @media (max-width: 1024px) and (orientation: landscape) {
    min-height: 100vh;
    padding: 60px 0;
    
    &__background {
      min-width: 1200px;
    }

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
    
    &__background {
      min-width: 1000px;
      
      svg {
        opacity: 0.4;
      }
    }

    &__gradient-overlay {
      height: 20%;
    }
    
    &__title {
      &-accent {
        white-space: normal; // Разрешаем перенос на планшетах
      }
    }
    
    &__description {
      &-break {
        display: inline;
        margin-top: 0;
      }
    }
    
    &__button {
      width: 100%;
      max-width: 400px;
    }
  }

  // Мобильные устройства
  @media (max-width: 480px) {
    padding-top: 40px;
    min-height: calc(100vh - 40px);
    min-height: calc(100dvh - 40px);
    
    &__container {
      padding: 0 12px;
    }
    
    &__background {
      min-width: 800px;
      
      svg {
        opacity: 0.3;
      }
    }

    &__gradient-overlay {
      height: 150px; // Фиксированная высота на мобильных
    }
    
    &__content {
      padding: 20px 0;
    }
    
    &__title {
      font-size: 24px;
      line-height: 1.3;
      margin-bottom: 20px;
      
      &-accent {
        display: inline-block;
        margin: 2px 0;
      }
    }
    
    &__description {
      font-size: 16px;
      line-height: 1.4;
      margin-bottom: 25px;
      padding: 0 10px;
    }
    
    &__button {
      width: calc(100% - 24px);
      max-width: none;
      padding: 14px 24px;
      font-size: 18px;
      border-radius: 12px;
    }
    
    &__note {
      font-size: 14px;
      margin-top: 15px;
    }
  }

  // Очень маленькие экраны
  @media (max-width: 360px) {
    &__title {
      font-size: 22px;
    }
    
    &__description {
      font-size: 15px;
    }
    
    &__button {
      font-size: 16px;
      padding: 12px 20px;
    }

    &__gradient-overlay {
      height: 120px;
    }
  }

  // Высокие экраны (для правильного центрирования)
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
    
    &__note {
      margin-top: 10px;
    }

    &__gradient-overlay {
      height: 100px;
    }
  }
}
</style>