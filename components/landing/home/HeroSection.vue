<template>
  <section class="calculator-section">
    <div class="container section-grid">
      <div class="content">
        <h2 class="title">
          Рассчитайте всё, что положено<br />
          вашей семье
        </h2>
        
        <p class="description">
          Точные калькуляторы пособий, льгот и<br />
          выплат. От декретных до ипотеки. Бесплатно<br />
          и без регистрации.
        </p>
        
        <button class="cta-button">
          смотреть все калькуляторы
        </button>
      </div>
      <div class="calculator3d-wrapper">
        <Calculator3D />
      </div>
    </div>
  </section>
</template>

<script setup>
import Calculator3D from './Calculator3D.vue';

</script>

<style scoped>
.calculator-section {
  background: #1775F6;
  padding: 80px 20px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 56px;
  max-width: 980px;
  width: 100%;
}

.content {
  flex: 1 1 0%;
  text-align: left;
  min-width: 270px;
}

.calculator3d-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 240px;
  /* плавное появление */
  animation: fadeIn 1.3s;
  transition: max-width 0.4s, min-width 0.4s;
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(40px);}
  to   {opacity: 1; transform: translateY(0);}
}

.title {
  color: #FFFFFF;
  font-size: 42px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.description {
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.95;
}

.cta-button {
  background: #FFFFFF;
  color: #333333;
  border: none;
  border-radius: 15px;
  padding: 18px 40px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.cta-button:active {
  transform: translateY(0);
}

@media (max-width: 900px) {
  .section-grid {
    flex-direction: column-reverse;
    gap: 28px;
  }
  .content {
    text-align: center;
  }
  .calculator3d-wrapper {
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .calculator-section {
    padding: 60px 10px;
  }
  
  .title {
    font-size: 37px;
    margin-bottom: 20px;
  }
  
  .description {
    font-size: 16px;
    margin-bottom: 32px;
    line-height: 1.4;
  }
  
  .cta-button {
    padding: 17px 34px;
    font-size: 17px;
  }
  .calculator3d-wrapper {
    min-width: 0;
    width: 95vw;
    max-width: 180px;
  }
}

</style>