<template>
  <section id="faq" class="benefits-section">
    <div class="container">
      <h2 class="benefits-title">Почему можно доверять нашим расчетам?</h2>
      
      <div class="benefits-grid">
        <!-- Преимущество 1 -->
        <div class="benefit-card">
          <div class="benefit-icon-wrapper">
            <span class="benefit-icon">⚡</span>
          </div>
          <h3 class="benefit-card-title">Актуально</h3>
          <p class="benefit-card-description">Все калькуляторы обновлены под законы 2025 года</p>
        </div>

        <!-- Преимущество 2 -->
        <div class="benefit-card">
          <div class="benefit-icon-wrapper">
            <span class="benefit-icon">🔐</span>
          </div>
          <h3 class="benefit-card-title">Анонимно</h3>
          <p class="benefit-card-description">Мы не сохраняем ваши данные. Все расчеты — в вашем браузере</p>
        </div>

        <!-- Преимущество 3 -->
        <div class="benefit-card">
          <div class="benefit-icon-wrapper">
            <span class="benefit-icon">📖</span>
          </div>
          <h3 class="benefit-card-title">Подробно</h3>
          <p class="benefit-card-description">Показываем формулы и законы, на основе которых считаем</p>
        </div>

        <!-- Преимущество 4 -->
        <div class="benefit-card">
          <div class="benefit-icon-wrapper">
            <span class="benefit-icon">👍</span>
          </div>
          <h3 class="benefit-card-title">Просто</h3>
          <p class="benefit-card-description">Вводите только самое необходимое</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Компонент не требует логики, только отображение
</script>

<style scoped lang="scss">
.benefits-section {
  padding: 100px 20px;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.benefits-title {
  font-size: 42px;
  font-weight: 600;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 70px;
  line-height: 1.3;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 50px;
  }
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.benefit-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2b7bf6, #3b82f6);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
    border-color: #2b7bf6;
    
    &::before {
      opacity: 1;
    }
    
    .benefit-icon-wrapper {
      transform: scale(1.1) translateY(-5px);
      background: linear-gradient(135deg, #2b7bf6, #3b82f6);
    }
    
    .benefit-icon {
      color: white;
    }
  }
}

.benefit-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  transition: all 0.3s ease;
  position: relative;
}

.benefit-icon {
  font-size: 36px;
  transition: all 0.3s ease;
}

.benefit-card-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 15px;
  line-height: 1.3;
}

.benefit-card-description {
  font-size: 16px;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
}

// Адаптивность
@media (max-width: 992px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
  
  .benefit-card {
    padding: 35px 25px;
  }
}

@media (max-width: 768px) {
  .benefits-section {
    padding: 80px 20px;
  }
  
  .benefits-title {
    font-size: 32px;
    margin-bottom: 50px;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .benefit-card {
    padding: 30px 25px;
  }
  
  .benefit-icon-wrapper {
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
  }
  
  .benefit-icon {
    font-size: 32px;
  }
  
  .benefit-card-title {
    font-size: 20px;
  }
  
  .benefit-card-description {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .benefits-section {
    padding: 60px 15px;
  }
  
  .benefits-title {
    font-size: 28px;
    margin-bottom: 40px;
  }
  
  .benefit-card {
    padding: 25px 20px;
    border-radius: 16px;
  }
  
  .benefit-icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    margin-bottom: 18px;
  }
  
  .benefit-icon {
    font-size: 28px;
  }
}
</style>