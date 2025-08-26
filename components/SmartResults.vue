<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  calculationData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['recalculate'])

const data = computed(() => props.calculationData)

// Проверка наличия проблем с имуществом
const hasPropertyIssues = computed(() => {
  const check = data.value.formData.propertyCheck
  if (!check) return false
  return check.hasMultipleApartments || check.hasMultipleCars || 
         check.hasLuxuryCar || check.hasHighSavings
})

// Проверка особых обстоятельств
const hasSpecialCircumstances = computed(() => {
  const special = data.value.formData.special
  if (!special) return false
  return special.singleParent || special.hasDisabled || special.mobilized
})

// Нужна ли проверка нулевого дохода
const needsZeroIncomeRule = computed(() => {
  return data.value.calculations.incomePercent < 30
})

// Форматирование суммы
const formatAmount = (amount) => {
  return new Intl.NumberFormat('ru-RU').format(amount)
}

// Склонение слова "ребенок"
const getChildrenWord = (count) => {
  if (count === 1) return 'ребенка'
  if (count >= 2 && count <= 4) return 'детей'
  return 'детей'
}

// Класс для дохода
const getIncomeClass = () => {
  const percent = data.value.calculations.incomePercent
  if (percent <= 100) return 'success'
  return 'error'
}

// Пересчет
const recalculate = () => {
  emit('recalculate')
}

// Печать результатов
const printResults = () => {
  window.print()
}
</script>

<template>
  <div class="results-container">
    <div class="result-card" :class="data.isEligible ? 'success' : 'error'">
      <!-- Заголовок результата -->
      <div class="result-header">
        <div class="result-icon">
          <svg v-if="data.isEligible" width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="30" fill="#00B93E" fill-opacity="0.1"/>
            <path d="M20 30L26 36L40 22" stroke="#00B93E" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <svg v-else width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="30" fill="#FF4444" fill-opacity="0.1"/>
            <path d="M22 22L38 38M38 22L22 38" stroke="#FF4444" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <h2 class="result-title dark-text">
          {{ data.isEligible ? 'Вам положено единое пособие!' : 'К сожалению, вы не подходите' }}
        </h2>
      </div>

      <!-- Размер пособия для одобренных -->
      <div v-if="data.isEligible" class="benefit-amount">
        <p class="amount-label light-text">Размер ежемесячного пособия:</p>
        <p class="amount-value dark-text">{{ formatAmount(data.benefitAmount) }} ₽</p>
        
        <!-- Детализация пособия -->
        <div class="benefit-breakdown" v-if="data.benefitDetails && data.benefitDetails.length">
          <div v-for="detail in data.benefitDetails" :key="detail.type" class="breakdown-item">
            <span v-if="detail.type === 'children'" class="breakdown-text">
              На {{ detail.count }} {{ getChildrenWord(detail.count) }}: 
              {{ formatAmount(detail.amountPerChild) }} ₽ × {{ detail.count }} = 
              <strong>{{ formatAmount(detail.total) }} ₽</strong>
              <span class="percent-badge">{{ detail.percent }}% от ПМ</span>
            </span>
            <span v-if="detail.type === 'pregnancy'" class="breakdown-text">
              Пособие беременной: 
              <strong>{{ formatAmount(detail.amount) }} ₽</strong>
              <span class="percent-badge">{{ detail.percent }}% от ПМ</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Причины отказа -->
      <div v-else class="denial-reasons">
        <p class="reason-label light-text">Причины отказа:</p>
        <ul class="reasons-list">
          <li v-for="(reason, index) in data.denialReasons" :key="index" class="reason-item dark-text">
            {{ reason }}
          </li>
        </ul>
      </div>

      <!-- Сводка по данным -->
      <div class="summary-section">
        <h3 class="summary-title dark-text">Ваши данные:</h3>
        
        <!-- Основная информация -->
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label light-text">Регион:</span>
            <span class="summary-value dark-text">{{ data.regionData.name }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label light-text">Прожиточный минимум:</span>
            <span class="summary-value dark-text">{{ formatAmount(data.regionData.pmValue) }} ₽</span>
          </div>
          <div class="summary-item">
            <span class="summary-label light-text">Состав семьи:</span>
            <span class="summary-value dark-text">{{ data.calculations.totalFamilyMembers }} чел.</span>
          </div>
          <div class="summary-item" v-if="data.calculations.totalChildren > 0">
            <span class="summary-label light-text">Детей до 17 лет:</span>
            <span class="summary-value dark-text">{{ data.calculations.totalChildren }}</span>
          </div>
        </div>

        <!-- Доходы -->
        <div class="income-summary-card">
          <h4 class="card-title">Доходы семьи</h4>
          <div class="income-details">
            <div class="income-row">
              <span class="label">Общий доход за год:</span>
              <span class="value">{{ formatAmount(data.calculations.totalYearlyIncome) }} ₽</span>
            </div>
            <div class="income-row">
              <span class="label">Среднедушевой доход в месяц:</span>
              <span class="value" :class="getIncomeClass()">
                {{ formatAmount(data.calculations.averageMonthlyIncome) }} ₽
              </span>
            </div>
            <div class="income-row">
              <span class="label">% от прожиточного минимума:</span>
              <span class="value" :class="getIncomeClass()">
                {{ data.calculations.incomePercent }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Имущество (если есть превышения) -->
        <div v-if="hasPropertyIssues" class="property-summary-card warning">
          <h4 class="card-title">⚠️ Имущественные ограничения</h4>
          <div class="property-list">
            <div v-if="data.formData.propertyCheck?.hasMultipleApartments" class="property-row">
              <span>❌ Более одной квартиры</span>
            </div>
            <div v-if="data.formData.propertyCheck?.hasMultipleCars" class="property-row">
              <span>❌ Более одного автомобиля</span>
            </div>
            <div v-if="data.formData.propertyCheck?.hasLuxuryCar" class="property-row">
              <span>❌ Автомобиль премиум-класса</span>
            </div>
            <div v-if="data.formData.propertyCheck?.hasHighSavings" class="property-row">
              <span>❌ Высокие сбережения</span>
            </div>
          </div>
        </div>

        <!-- Особые обстоятельства -->
        <div v-if="hasSpecialCircumstances" class="special-card">
          <h4 class="card-title">Особые обстоятельства</h4>
          <ul class="special-list">
            <li v-if="data.formData.special?.singleParent">Единственный родитель</li>
            <li v-if="data.formData.special?.hasDisabled">В семье есть инвалид</li>
            <li v-if="data.formData.special?.mobilized">Член семьи мобилизован</li>
          </ul>
        </div>
      </div>

      <!-- Что делать дальше -->
      <div v-if="data.isEligible" class="next-steps">
        <h3 class="steps-title dark-text">Что делать дальше?</h3>
        <ol class="steps-list">
          <li>
            <strong>Подайте заявление</strong> через портал Госуслуг или в МФЦ
          </li>
          <li>
            <strong>Приложите документы:</strong>
            <ul>
              <li>Паспорт</li>
              <li>Свидетельства о рождении детей</li>
              <li>Справки о доходах за 12 месяцев</li>
              <li v-if="data.formData.recipientType === 'pregnant' || data.formData.recipientType === 'both'">
                Справка о постановке на учет по беременности
              </li>
              <li v-if="data.formData.special?.hasDisabled">Документы об инвалидности</li>
              <li v-if="data.formData.special?.mobilized">Документы о мобилизации</li>
            </ul>
          </li>
          <li>
            <strong>Дождитесь решения</strong> (до 10 рабочих дней, максимум 30 дней)
          </li>
          <li>
            <strong>Получайте выплаты</strong> ежемесячно на карту "Мир" или почтовым переводом
          </li>
        </ol>
      </div>

      <!-- Рекомендации для отказников -->
      <div v-else class="recommendations">
        <h3 class="steps-title dark-text">Что можно сделать?</h3>
        <ul class="recommendations-list">
          <li v-if="data.calculations.incomePercent > 100">
            <strong>Проверьте другие пособия:</strong> Вы можете иметь право на региональные выплаты
          </li>
          <li v-if="hasPropertyIssues">
            <strong>Пересмотрите имущество:</strong> Некоторые виды имущества не учитываются при наличии инвалидности в семье
          </li>
          <li v-if="!data.formData.hasValidReason && needsZeroIncomeRule">
            <strong>Трудоустройство:</strong> Официальное трудоустройство или постановка на учет в центр занятости
          </li>
          <li>
            <strong>Повторная подача:</strong> Вы можете подать заявление позже, когда изменятся обстоятельства
          </li>
        </ul>
      </div>

      <!-- Полезная информация -->
      <div class="info-cards">
        <div class="info-card">
          <h4>📅 Период выплат</h4>
          <p>Пособие назначается на 12 месяцев. Затем нужно подать новое заявление.</p>
        </div>
        
        <div class="info-card">
          <h4>💳 Способы получения</h4>
          <p>На карту "Мир", почтовым переводом или на счет в банке.</p>
        </div>
        
        <div class="info-card">
          <h4>📞 Горячая линия</h4>
          <p>Единый контакт-центр: <strong>8-800-2000-412</strong> (звонок бесплатный)</p>
        </div>
        
        <div class="info-card">
          <h4>🏢 Куда обращаться</h4>
          <p>МФЦ, Социальный фонд России или портал Госуслуг</p>
        </div>
      </div>

      <!-- Действия -->
      <div class="actions">
        <button @click="recalculate" class="action-button secondary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 10C2 14.418 5.582 18 10 18C12.15 18 14.078 17.086 15.47 15.63L14 14.16C12.97 15.19 11.57 15.82 10 15.82C6.69 15.82 4 13.14 4 9.82C4 6.5 6.69 3.82 10 3.82C11.58 3.82 12.96 4.44 14 5.48L12 7.48H18V1.48L15.47 4.01C14.08 2.56 12.15 1.64 10 1.64C5.582 1.64 2 5.222 2 9.64V10Z" fill="#008CFF"/>
          </svg>
          Пересчитать
        </button>
        
        <button @click="printResults" class="action-button primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16 8H14V3H6V8H4C2.9 8 2 8.9 2 10V15H6V18H14V15H18V10C18 8.9 17.1 8 16 8ZM8 5H12V8H8V5ZM12 16H8V13H12V16ZM16 13H14V11H6V13H4V10H16V13Z" fill="white"/>
          </svg>
          Распечатать результат
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.results-container {
  width: 100%;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  &.success {
    border-top: 4px solid #00B93E;
  }
  
  &.error {
    border-top: 4px solid #FF4444;
  }
}

.result-header {
  text-align: center;
  margin-bottom: 30px;
  
  .result-icon {
    margin-bottom: 20px;
  }
  
  .result-title {
    font-size: 28px;
    font-weight: 600;
    margin: 0;
  }
}

.benefit-amount {
  text-align: center;
  padding: 25px;
  background: linear-gradient(135deg, #00B93E10, #00B93E05);
  border-radius: 12px;
  margin-bottom: 30px;
  
  .amount-label {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .amount-value {
    font-size: 36px;
    font-weight: 700;
    color: #00B93E;
    margin: 0;
  }
}

.benefit-breakdown {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #00B93E20;
  
  .breakdown-item {
    margin-bottom: 10px;
    font-size: 14px;
    
    .breakdown-text {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    strong {
      color: #00B93E;
      font-weight: 600;
    }
    
    .percent-badge {
      background: #00B93E20;
      color: #00B93E;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
  }
}

.denial-reasons {
  padding: 20px;
  background: #FF444410;
  border-radius: 12px;
  margin-bottom: 30px;
  
  .reason-label {
    font-size: 16px;
    margin-bottom: 15px;
  }
  
  .reasons-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    .reason-item {
      padding: 10px 0;
      padding-left: 25px;
      position: relative;
      
      &:before {
        content: "✗";
        position: absolute;
        left: 0;
        color: #FF4444;
        font-weight: bold;
      }
    }
  }
}

.summary-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
  
  .summary-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
  
  .summary-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    
    .summary-label {
      font-size: 14px;
    }
    
    .summary-value {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.income-summary-card,
.property-summary-card,
.special-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  
  &.warning {
    background: #fff3e0;
    border: 1px solid #ffcc80;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #2C3E50;
  }
}

.income-details {
  .income-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    
    .value {
      font-weight: 600;
      
      &.success { color: #00B93E; }
      &.error { color: #FF4444; }
    }
  }
}

.property-list {
  .property-row {
    padding: 8px 0;
    color: #d32f2f;
  }
}

.special-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    padding: 8px 0;
    padding-left: 20px;
    position: relative;
    
    &:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #008CFF;
    }
  }
}

.next-steps,
.recommendations {
  background: #e3f2fd;
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  
  .steps-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .steps-list,
  .recommendations-list {
    padding-left: 20px;
    
    > li {
      margin-bottom: 15px;
      
      strong {
        color: #1976d2;
      }
      
      ul {
        margin-top: 10px;
        padding-left: 20px;
        
        li {
          margin-bottom: 5px;
        }
      }
    }
  }
}

.recommendations {
  background: #fff3e0;
  
  strong {
    color: #f57c00;
  }
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 30px 0;
  
  .info-card {
    padding: 20px;
    background: #fafbfc;
    border-radius: 10px;
    
    h4 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #2C3E50;
    }
    
    p {
      font-size: 14px;
      margin: 0;
      color: #7d838b;
      
      strong {
        color: #008CFF;
      }
    }
  }
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    
    &.primary {
      background: #008CFF;
      color: white;
      
      &:hover {
        background: #0070d2;
      }
    }
    
    &.secondary {
      background: white;
      color: #008CFF;
      border: 2px solid #008CFF;
      
      &:hover {
        background: #008CFF10;
      }
    }
  }
}

@media print {
  .actions {
    display: none;
  }
  
  .result-card {
    box-shadow: none;
    border: 1px solid #e0e0e0;
  }
}

@media (max-width: 768px) {
  .result-card {
    padding: 20px;
  }
  
  .result-title {
    font-size: 22px !important;
  }
  
  .amount-value {
    font-size: 28px !important;
  }
  
  .actions {
    flex-direction: column;
    
    .action-button {
      width: 100%;
    }
  }
}
</style>