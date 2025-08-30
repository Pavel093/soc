<template>
  <section class="widget-section">
    <div class="container">
      <div class="widget-content">
        <div class="widget-text">
          <h2 class="widget-subtitle">Для веб-мастеров и организаций</h2>
          <h1 class="widget-title">Бесплатный виджет калькулятора для вашего сайта</h1>
          <p class="widget-description">
            Помогите своим посетителям узнать о пособиях. Разместите наш точный и актуальный калькулятор у себя — это бесплатно и займет 5 минут.
          </p>
          <button class="widget-button">Получить код виджета</button>
        </div>
        
        <div class="widget-visual">
          <div class="widget-placeholder">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6H14M14 10H10M14 14H10M14 18H10M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p>Виджет калькулятора</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped lang="scss">
.widget-section {
  padding: 80px 0;
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .widget-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 40px;
      text-align: center;
    }
  }
  
  .widget-text {
    .widget-subtitle {
      font-size: 18px;
      font-weight: 600;
      color: #2b7bf6;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      @media (max-width: 768px) {
        font-size: 16px;
      }
    }
    
    .widget-title {
      font-size: 42px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 24px;
      line-height: 1.2;
      
      @media (max-width: 768px) {
        font-size: 32px;
      }
      
      @media (max-width: 480px) {
        font-size: 28px;
      }
    }
    
    .widget-description {
      font-size: 18px;
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 32px;
      
      @media (max-width: 768px) {
        font-size: 16px;
      }
    }
  }
  
  .widget-button {
    background: #2b7bf6;
    color: white;
    border: none;
    border-radius: 15px;
    padding: 18px 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #1a6ad8;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(43, 123, 246, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  .widget-visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .widget-placeholder {
    width: 280px;
    height: 350px;
    background: linear-gradient(135deg, #2b7bf6 0%, #1775F6 100%);
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    padding: 30px;
    box-shadow: 0 20px 40px rgba(43, 123, 246, 0.25);
    
    svg {
      width: 60px;
      height: 60px;
      margin-bottom: 20px;
      opacity: 0.9;
    }
    
    p {
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      margin: 0;
      opacity: 0.9;
    }
    
    @media (max-width: 480px) {
      width: 240px;
      height: 300px;
      
      svg {
        width: 50px;
        height: 50px;
      }
      
      p {
        font-size: 14px;
      }
    }
  }
}

// Анимация для плавающего эффекта
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.widget-placeholder {
  animation: float 4s ease-in-out infinite;
}
</style>