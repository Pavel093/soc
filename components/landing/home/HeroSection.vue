<template>
  <section class="calculator-section">
    <div class="container section-grid">
      <div class="content">
        <h2 class="title">
          Рассчитайте всё, что положеношшшшшш<br />
          <span class="title-accent">вашей семье</span>
        </h2>
        
        <p class="description">
          Точные калькуляторы пособий, льгот и<br />
          выплат. От декретных до ипотеки. Бесплатно<br />
          и без регистрации.
        </p>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">✓</div>
            <span>Точные расчеты</span>
          </div>
          <div class="feature">
            <div class="feature-icon">✓</div>
            <span>Без регистрации</span>
          </div>
          <div class="feature">
            <div class="feature-icon">✓</div>
            <span>Всегда бесплатно</span>
          </div>
        </div>
        
        <a href="#all-calculators" class="cta-button">
          <span>смотреть все калькуляторы</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
      <div class="calculator3d-wrapper">
        <Calculator3D />
        <div class="floating-elements">
          <div class="floating-element element-1"></div>
          <div class="floating-element element-2"></div>
          <div class="floating-element element-3"></div>
        </div>
      </div>
    </div> 
  </section>
</template>

<script setup>
import Calculator3D from './Calculator3D.vue';
</script>

<style scoped>
.calculator-section {
  background: #f5f7fa;
  padding: 100px 20px;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.calculator-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.section-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 2;
}

.content {
  flex: 1;
  max-width: 500px;
}

.calculator3d-wrapper {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  color: #1e293b;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.title-accent {
  color: #2b7bf6;
}

.description {
  color: #64748b;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: 32px;
  opacity: 0.9;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
  font-size: 16px;
  font-weight: 500;
}

.feature-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2b7bf6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.cta-button {
  background: #2b7bf6;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 20px 40px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 25px rgba(43, 123, 246, 0.25);
}

.cta-button:hover {
  background: #1d6de3;
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(43, 123, 246, 0.35);
  gap: 16px;
}

.cta-button:active {
  transform: translateY(-1px);
}

.cta-button svg {
  transition: transform 0.3s ease;
}

.cta-button:hover svg {
  transform: translateX(4px);
}

/* Floating elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: rgba(43, 123, 246, 0.08);
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.element-3 {
  width: 40px;
  height: 40px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Анимация появления */
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

.content > * {
  animation: fadeInUp 0.8s ease-out forwards;
}

.content > *:nth-child(1) { animation-delay: 0.1s; }
.content > *:nth-child(2) { animation-delay: 0.3s; }
.content > *:nth-child(3) { animation-delay: 0.5s; }
.content > *:nth-child(4) { animation-delay: 0.7s; }

.calculator3d-wrapper {
  animation: fadeInUp 1s ease-out 0.2s both;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .section-grid {
    gap: 60px;
  }
  
  .title {
    font-size: 42px;
  }
}

@media (max-width: 900px) {
  .section-grid {
    flex-direction: column-reverse;
    gap: 40px;
    text-align: center;
  }
  
  .content {
    max-width: 100%;
  }
  
  .features {
    align-items: center;
  }
}

@media (max-width: 768px) {
  .calculator-section {
    padding: 80px 20px;
  }
  
  .title {
    font-size: 36px;
    margin-bottom: 20px;
  }
  
  .description {
    font-size: 16px;
    margin-bottom: 28px;
  }
  
  .cta-button {
    padding: 18px 32px;
    font-size: 16px;
  }
  
  .floating-element {
    display: none;
  }
}

@media (max-width: 480px) {
  .calculator-section {
    padding: 60px 16px;
  }
  
  .title {
    font-size: 32px;
  }
  
  .feature {
    font-size: 14px;
  }
  
  .cta-button {
    width: 100%;
    justify-content: center;
  }
}
</style>