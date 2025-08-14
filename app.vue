<template>
  <div class="app-container">
    <SmartCalculator />
  </div>
</template>

<script setup>
import SmartCalculator from './components/SmartCalculator.vue'
</script>

<style lang="scss">
// Глобальные стили из вашего проекта
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f7fa;
  color: #333;
}

// Ваши цветовые классы
.base-bg-color {
  background-color: #F0F4FF;
}

.base-bg-color-two {
  background-color: #FAFBFC;
}

.dark-text {
  color: #2C3E50;
}

.light-text {
  color: #7d838b;
}

// Стили для select из вашего проекта
.region-select {
  width: 100%;
  padding: 12px 40px 12px 12px;
  border: 1px solid #C4C2FF;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23008CFF' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  &:focus {
    outline: none;
    border-color: #008CFF;
    box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.1);
  }
  
  &:hover {
    border-color: #008CFF;
  }
}

// Стили чекбоксов из вашего проекта
.custom-checkbox {
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  user-select: none;
  
  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    
    &:checked ~ .checkmark {
      background-color: #008CFF;
      border-color: #008CFF;
      
      &:after {
        opacity: 1;
      }
    }
  }
  
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: white;
    border: 2px solid #C4C2FF;
    border-radius: 4px;
    transition: all 0.3s;
    
    &:after {
      content: "";
      position: absolute;
      opacity: 0;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      transition: opacity 0.3s;
    }
  }
}

.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 0;
  }
}
</style>