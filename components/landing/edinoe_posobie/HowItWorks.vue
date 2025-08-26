<template>
  <div class="how-it-works">
    <div class="container">
      <h1 class="title">
        Как это <span class="highlight">работает</span>?
      </h1>
      
      <div class="steps">
        <div class="step">
          <div class="step__number">1</div>
          <p class="step__text">
            Укажите доход, состав семьи и имущество. Это займет не более 5 минут.
          </p>
        </div>
        
        <div class="step step--active">
          <div class="step__number">2</div>
          <p class="step__text">
            Узнайте, какие именно пособия вам положены и в каком размере.
          </p>
        </div>
        
        <div class="step">
          <div class="step__number">3</div>
          <p class="step__text">
            Скачайте результат в PDF или изображение. Это ваш план для обращения за выплатами.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.how-it-works {
  padding: 80px 20px;
  display: flex;
  align-items: center;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  .title {
    font-size: 52px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 60px;
    color: #1a1a1a;
    
    .highlight {
      color: #2b7bf6;
    }
    
    @media (max-width: 768px) {
      font-size: 32px;
      margin-bottom: 40px;
    }
  }
  
  .steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    align-items: stretch; /* Добавлено для выравнивания высоты карточек */
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 20px;
      max-width: 500px;
      margin: 0 auto;
    }
  }
  
  .step {
    background: #B4B4B4;
    border-radius: 35px;
    padding: 25px;
    display: flex; /* Добавлено */
    flex-direction: column; /* Добавлено */
    height: 100%; /* Добавлено для одинаковой высоты */
    
    p{
        color: black;
    }

    &--active {
      background: #2b7bf6;
      p{
        color: white;
    }
    }
    
    &__number {
      width: 55px;
      height: 55px;
      background: white;
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 20px;
    }
    
    &__text {
      font-size: 19px;
      line-height: 1.6;
      color: white;
      margin: 0;
      margin-top: auto; /* Добавлено для прижатия текста к низу */
      
      @media (max-width: 768px) {
        font-size: 16px;
      }
    }
  }
}
</style>