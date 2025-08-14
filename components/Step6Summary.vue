<template>
  <div class="summary-step">
    <h2 class="step-title dark-text">6. Проверка данных</h2>
    
    <div class="summary-content">
      <div class="summary-section">
        <h3>Состав семьи</h3>
        <p>Размер семьи: {{ store.familySize }} чел.</p>
        <p v-if="store.isPregnant">Беременная: да ({{ store.pregnancyWeeks }} недель)</p>
        <p v-if="store.childrenCount">Детей до 17 лет: {{ store.childrenCount }}</p>
        <p v-if="store.hasStudents">Студентов: {{ store.studentsCount }}</p>
        <p v-if="store.hasSpouse">Супруг(а): есть</p>
      </div>
      
      <div class="summary-section">
        <h3>Регион и прожиточный минимум</h3>
        <p>Регион: {{ store.region }}</p>
        <p>Прожиточный минимум: {{ store.pmValue }} руб.</p>
      </div>
      
      <div class="summary-section">
        <h3>Доходы</h3>
        <p>Общий годовой доход: {{ store.totalYearlyIncome }} руб.</p>
        <p>Среднедушевой доход: {{ store.monthlyIncomePerPerson }} руб./мес</p>
        <p>Статус: 
          <span :class="store.monthlyIncomePerPerson < store.pmValue ? 'text-success' : 'text-danger'">
            {{ store.monthlyIncomePerPerson < store.pmValue ? '✓ Ниже ПМ' : '✗ Выше ПМ' }}
          </span>
        </p>
      </div>
      
      <div class="summary-section">
        <h3>Имущество</h3>
        <p>Соответствует требованиям: 
          <span :class="store.propertyRequirementsMet ? 'text-success' : 'text-danger'">
            {{ store.propertyRequirementsMet ? '✓ Да' : '✗ Нет' }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCalculatorStore } from '../stores/calculatorStore'
const store = useCalculatorStore()
</script>

<style scoped>
.summary-content {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.summary-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.summary-section h3 {
  margin-top: 0;
  color: #495057;
  font-size: 16px;
}

.summary-section p {
  margin: 8px 0;
  color: #6c757d;
}

.text-success {
  color: #28a745;
  font-weight: bold;
}

.text-danger {
  color: #dc3545;
  font-weight: bold;
}
</style>