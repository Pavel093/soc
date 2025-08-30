<template>
  <section class="cta-section">
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">Узнайте о своих правах на поддержку от государства</h2>
        <p class="cta-subtitle">Рассчитайте, какие пособия вам положены, за 5 минут</p>
        <button class="cta-button" @click="handleCalculate">
          Рассчитать пособие
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.8333 5.83337L15 10.0001M15 10.0001L10.8333 14.1667M15 10.0001H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped lang="scss">
.cta-section {
  padding: 100px 20px;
  background: linear-gradient(135deg, #2b7bf6 0%, #1775F6 100%);
  text-align: center;
  color: white;
  
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .cta-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  
  .cta-title {
    font-size: 52px;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
    
    @media (max-width: 768px) {
      font-size: 36px;
    }
    
    @media (max-width: 480px) {
      font-size: 28px;
    }
  }
  
  .cta-subtitle {
    font-size: 20px;
    font-weight: 400;
    opacity: 0.9;
    margin: 0;
    line-height: 1.5;
    
    @media (max-width: 768px) {
      font-size: 18px;
    }
    
    @media (max-width: 480px) {
      font-size: 16px;
    }
  }
  
  .cta-button {
    background: white;
    color: #2b7bf6;
    border: none;
    border-radius: 15px;
    padding: 20px 40px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
    
    &:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(255, 255, 255, 0.25);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    @media (max-width: 768px) {
      padding: 18px 32px;
      font-size: 16px;
    }
    
    @media (max-width: 480px) {
      padding: 16px 28px;
      font-size: 15px;
    }
  }
}
</style>