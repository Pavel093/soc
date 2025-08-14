<template>
  <div class="result-container">
    <!-- Заголовок -->
    <div class="result-header">
      <h2 class="result-title">Результаты расчета единого пособия</h2>
      <p class="result-date">Расчет выполнен: {{ currentDate }}</p>
    </div>

    <!-- Основной результат -->
    <div class="main-result" :class="resultClass">
      <div v-if="isEligible" class="eligible-result">
        <div class="result-icon">✅</div>
        <h3>Вы имеете право на единое пособие!</h3>
        
        <div class="amount-block">
          <p class="amount-label">Предварительный размер пособия:</p>
          <p class="amount-value">{{ formatAmount(totalAmount) }} руб./мес</p>
        </div>

        <div class="amount-details">
          <div v-if="store.isPregnant && !store.childrenCount" class="detail-item">
            <span class="detail-label">Пособие беременной:</span>
            <span class="detail-value">{{ formatAmount(pregnantAmount) }} руб./мес</span>
          </div>
          
          <div v-if="store.childrenCount > 0" class="detail-item">
            <span class="detail-label">Пособие на {{ store.childrenCount }} {{ childrenText }}:</span>
            <span class="detail-value">{{ formatAmount(childrenAmount) }} руб./мес</span>
          </div>
          
          <div v-if="store.childrenCount > 0" class="detail-item sub-detail">
            <span class="detail-label">На каждого ребенка:</span>
            <span class="detail-value">{{ formatAmount(perChildAmount) }} руб./мес</span>
          </div>
        </div>
      </div>

      <div v-else class="not-eligible-result">
        <div class="result-icon">❌</div>
        <h3>К сожалению, вы не соответствуете условиям</h3>
        
        <div class="reasons-block">
          <h4>Причины отказа:</h4>
          <ul class="reasons-list">
            <li v-for="reason in rejectionReasons" :key="reason" class="reason-item">
              {{ reason }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Детальная информация -->
    <div class="details-section">
      <!-- Проверка условий -->
      <div class="check-section">
        <h3 class="section-title">Проверка условий назначения</h3>
        
        <div class="check-grid">
          <div class="check-card" :class="incomeCheck.status">
            <div class="check-header">
              <span class="check-icon">{{ incomeCheck.icon }}</span>
              <span class="check-title">Доходы семьи</span>
            </div>
            <div class="check-body">
              <p class="check-value">{{ incomeCheck.value }}</p>
              <p class="check-desc">{{ incomeCheck.description }}</p>
            </div>
          </div>

          <div class="check-card" :class="propertyCheck.status">
            <div class="check-header">
              <span class="check-icon">{{ propertyCheck.icon }}</span>
              <span class="check-title">Имущество</span>
            </div>
            <div class="check-body">
              <p class="check-value">{{ propertyCheck.value }}</p>
              <p class="check-desc">{{ propertyCheck.description }}</p>
            </div>
          </div>

          <div class="check-card" :class="zeroIncomeCheck.status">
            <div class="check-header">
              <span class="check-icon">{{ zeroIncomeCheck.icon }}</span>
              <span class="check-title">Правило нулевого дохода</span>
            </div>
            <div class="check-body">
              <p class="check-value">{{ zeroIncomeCheck.value }}</p>
              <p class="check-desc">{{ zeroIncomeCheck.description }}</p>
            </div>
          </div>

          <div class="check-card" :class="benefitsCheck.status">
            <div class="check-header">
              <span class="check-icon">{{ benefitsCheck.icon }}</span>
              <span class="check-title">Другие пособия</span>
            </div>
            <div class="check-body">
              <p class="check-value">{{ benefitsCheck.value }}</p>
              <p class="check-desc">{{ benefitsCheck.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Расчет размера пособия -->
      <div v-if="isEligible" class="calculation-section">
        <h3 class="section-title">Как рассчитан размер пособия</h3>
        
        <div class="calculation-steps">
          <div class="calc-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Базовый размер - 50% прожиточного минимума</h4>
              <p>Среднедушевой доход: {{ formatAmount(store.averageIncome) }} руб.</p>
              <p>Прожиточный минимум: {{ formatAmount(store.pmValue) }} руб.</p>
              <p class="step-result">Базовое пособие: {{ formatAmount(baseAmount) }} руб./мес</p>
            </div>
          </div>

          <div v-if="benefitLevel > 50" class="calc-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Проверка с учетом базового пособия</h4>
              <p>Доход с пособием 50%: {{ formatAmount(incomeWith50) }} руб.</p>
              <p v-if="incomeWith50 < store.pmValue">
                ❌ Все еще меньше прожиточного минимума
              </p>
              <p class="step-result">Увеличение до 75%: {{ formatAmount(amount75) }} руб./мес</p>
            </div>
          </div>

          <div v-if="benefitLevel === 100" class="calc-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Проверка с учетом пособия 75%</h4>
              <p>Доход с пособием 75%: {{ formatAmount(incomeWith75) }} руб.</p>
              <p v-if="incomeWith75 < store.pmValue">
                ❌ Все еще меньше прожиточного минимума
              </p>
              <p class="step-result">Максимальное пособие 100%: {{ formatAmount(amount100) }} руб./мес</p>
            </div>
          </div>

          <div v-if="store.isSingleParent" class="calc-step bonus">
            <div class="step-number">+</div>
            <div class="step-content">
              <h4>Повышение для единственного родителя</h4>
              <p>Применяется повышенный размер пособия</p>
              <p class="step-result">Дополнительно учтено в расчете</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Информация о выплатах -->
      <div v-if="isEligible" class="payment-section">
        <h3 class="section-title">Информация о выплатах</h3>
        
        <div class="payment-info">
          <div class="info-card">
            <h4>Период выплат</h4>
            <ul>
              <li v-if="store.isPregnant">Для беременных: с месяца постановки на учет до родов</li>
              <li v-if="store.childrenCount > 0">На детей: ежемесячно до достижения 17 лет</li>
              <li>Назначается на 12 месяцев, затем нужно подать заявление заново</li>
            </ul>
          </div>

          <div class="info-card">
            <h4>Когда придут деньги</h4>
            <ul>
              <li>Первая выплата - в течение 5 рабочих дней после одобрения</li>
              <li>Последующие - до 25 числа каждого месяца</li>
              <li>Выплата за полный месяц, независимо от даты подачи</li>
            </ul>
          </div>

          <div class="info-card">
            <h4>Способы получения</h4>
            <ul>
              <li>На карту «Мир»</li>
              <li>На счет в банке (без привязки к карте)</li>
              <li>Через почтовое отделение</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Что делать дальше -->
      <div class="action-section">
        <h3 class="section-title">Что делать дальше?</h3>
        
        <div v-if="isEligible" class="action-steps">
          <div class="action-item">
            <div class="action-number">1</div>
            <div class="action-content">
              <h4>Подготовьте документы</h4>
              <ul>
                <li>Паспорта всех взрослых членов семьи</li>
                <li>Свидетельства о рождении детей</li>
                <li>СНИЛС всех членов семьи</li>
                <li v-if="store.hasSpouse">Свидетельство о браке</li>
                <li v-if="!store.hasSpouse && store.childrenCount > 0">Документы о разводе/алиментах (при наличии)</li>
                <li>Справки о доходах (если не работаете официально)</li>
                <li>Реквизиты счета для получения пособия</li>
              </ul>
            </div>
          </div>

          <div class="action-item">
            <div class="action-number">2</div>
            <div class="action-content">
              <h4>Подайте заявление</h4>
              <div class="submit-options">
                <a href="https://www.gosuslugi.ru/" target="_blank" class="submit-btn primary">
                  <span class="btn-icon">🌐</span>
                  <span class="btn-text">
                    <strong>Через Госуслуги</strong>
                    <small>Онлайн, быстро и удобно</small>
                  </span>
                </a>
                
                <a href="#" class="submit-btn secondary">
                  <span class="btn-icon">🏢</span>
                  <span class="btn-text">
                    <strong>В МФЦ</strong>
                    <small>Личное обращение</small>
                  </span>
                </a>
                
                <a href="#" class="submit-btn secondary">
                  <span class="btn-icon">🏛️</span>
                  <span class="btn-text">
                    <strong>В Социальный фонд</strong>
                    <small>По месту жительства</small>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div class="action-item">
            <div class="action-number">3</div>
            <div class="action-content">
              <h4>Дождитесь решения</h4>
              <p>Срок рассмотрения - до 10 рабочих дней</p>
              <p>При необходимости дополнительной проверки - до 30 рабочих дней</p>
              <p>Уведомление придет в личный кабинет на Госуслугах</p>
            </div>
          </div>
        </div>

        <div v-else class="improvement-tips">
          <h4>Как улучшить ситуацию:</h4>
          <ul>
            <li v-if="store.averageIncome > store.pmValue">
              Проверьте правильность указанных доходов - учитываются доходы за 12 месяцев
            </li>
            <li v-if="!store.hasValidReason && store.hasZeroIncome">
              Устройтесь на работу или зарегистрируйтесь как самозанятый
            </li>
            <li v-if="propertyExcess">
              Пересмотрите имущественную ситуацию - возможно, стоит оформить имущество на других родственников
            </li>
            <li>Обратитесь в Социальный фонд за консультацией по вашей ситуации</li>
          </ul>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="additional-info">
        <h3 class="section-title">Полезная информация</h3>
        
        <div class="info-grid">
          <div class="info-item">
            <h4>📞 Горячая линия</h4>
            <p>8-800-100-00-01</p>
            <small>Бесплатно по России</small>
          </div>
          
          <div class="info-item">
            <h4>💬 Телеграм-бот СФР</h4>
            <p>@sfr_bot</p>
            <small>Консультации 24/7</small>
          </div>
          
          <div class="info-item">
            <h4>📱 Приложение СФР</h4>
            <p>Социальный навигатор</p>
            <small>iOS и Android</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="result-actions">
      <button @click="printResult" class="action-btn print">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/>
        </svg>
        Распечатать результат
      </button>
      
      <button @click="saveResult" class="action-btn save">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
        Сохранить расчет
      </button>
      
      <button @click="startOver" class="action-btn restart">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
        </svg>
        Начать заново
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()

// Текущая дата
const currentDate = new Date().toLocaleDateString('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})

// Проверка права на пособие
const isEligible = computed(() => {
  return store.incomeQualifies && 
         store.propertyQualifies && 
         store.zeroIncomeRuleOk &&
         !store.otherBenefits
})

// Класс для результата
const resultClass = computed(() => {
  return isEligible.value ? 'eligible' : 'not-eligible'
})

// Расчет размера пособия
const benefitLevel = computed(() => {
  if (!isEligible.value) return 0
  
  const avgIncome = store.averageIncome
  const pm = store.pmValue
  
  // Базовый уровень 50%
  let level = 50
  
  // Проверка с пособием 50%
  const with50 = avgIncome + (pm * 0.5)
  if (with50 < pm) {
    level = 75
    
    // Проверка с пособием 75%
    const with75 = avgIncome + (pm * 0.75)
    if (with75 < pm) {
      level = 100
    }
  }
  
  return level
})

// Суммы пособий
const baseAmount = computed(() => {
  const multiplier = benefitLevel.value / 100
  
  if (store.isPregnant && !store.childrenCount) {
    return Math.round(store.pmValue * multiplier)
  }
  
  if (store.childrenCount > 0) {
    return Math.round(store.pmChild * multiplier)
  }
  
  return 0
})

const pregnantAmount = computed(() => {
  if (!store.isPregnant || store.childrenCount > 0) return 0
  return baseAmount.value
})

const perChildAmount = computed(() => {
  if (store.childrenCount === 0) return 0
  return baseAmount.value
})

const childrenAmount = computed(() => {
  return perChildAmount.value * store.childrenCount
})

const totalAmount = computed(() => {
  return pregnantAmount.value + childrenAmount.value
})

// Для расчетов
const amount75 = computed(() => Math.round(store.pmChild * 0.75))
const amount100 = computed(() => store.pmChild)
const incomeWith50 = computed(() => store.averageIncome + (store.pmChild * 0.5))
const incomeWith75 = computed(() => store.averageIncome + (store.pmChild * 0.75))

// Проверки условий
const incomeCheck = computed(() => {
  const qualifies = store.incomeQualifies
  return {
    status: qualifies ? 'success' : 'error',
    icon: qualifies ? '✓' : '✗',
    value: `${formatAmount(store.averageIncome)} руб.`,
    description: qualifies 
      ? `Меньше прожиточного минимума (${formatAmount(store.pmValue)} руб.)`
      : `Превышает прожиточный минимум (${formatAmount(store.pmValue)} руб.)`
  }
})

const propertyCheck = computed(() => {
  const qualifies = store.propertyQualifies
  return {
    status: qualifies ? 'success' : 'error',
    icon: qualifies ? '✓' : '✗',
    value: qualifies ? 'Соответствует' : 'Не соответствует',
    description: qualifies
      ? 'Имущество в пределах установленных норм'
      : 'Превышены допустимые нормы по имуществу'
  }
})

const zeroIncomeCheck = computed(() => {
  const qualifies = store.zeroIncomeRuleOk
  return {
    status: qualifies ? 'success' : 'warning',
    icon: qualifies ? '✓' : '⚠',
    value: qualifies ? 'Соблюдено' : 'Требует внимания',
    description: qualifies
      ? 'Есть доходы или уважительные причины'
      : 'Необходимы доходы или уважительные причины'
  }
})

const benefitsCheck = computed(() => {
  const noConflict = !store.otherBenefits
  return {
    status: noConflict ? 'success' : 'warning',
    icon: noConflict ? '✓' : '⚠',
    value: noConflict ? 'Нет препятствий' : 'Есть конфликты',
    description: noConflict
      ? 'Можно получать единое пособие'
      : 'Нужно отказаться от других пособий'
  }
})

// Причины отказа
const rejectionReasons = computed(() => {
  const reasons = []
  
  if (!store.incomeQualifies) {
    reasons.push(`Среднедушевой доход (${formatAmount(store.averageIncome)} руб.) превышает прожиточный минимум`)
  }
  
  if (!store.propertyQualifies) {
    reasons.push('Имущество семьи превышает установленные нормы')
  }
  
  if (!store.zeroIncomeRuleOk) {
    reasons.push('Не соблюдено правило нулевого дохода - нет доходов и нет уважительных причин')
  }
  
  if (store.otherBenefits) {
    reasons.push('Вы получаете другие несовместимые пособия')
  }
  
  return reasons
})

const propertyExcess = computed(() => !store.propertyQualifies)

// Текст для детей
const childrenText = computed(() => {
  const count = store.childrenCount
  if (count === 1) return 'ребенка'
  if (count >= 2 && count <= 4) return 'детей'
  return 'детей'
})

// Методы
const formatAmount = (amount) => {
  return new Intl.NumberFormat('ru-RU').format(Math.round(amount))
}

const printResult = () => {
  window.print()
}

const saveResult = () => {
  const data = {
    date: new Date().toISOString(),
    eligible: isEligible.value,
    amount: totalAmount.value,
    region: store.selectedRegion,
    familySize: store.familySize,
    averageIncome: store.averageIncome
  }
  
  localStorage.setItem('unifiedBenefitResult', JSON.stringify(data))
  alert('Результат сохранен!')
}

const startOver = () => {
  if (confirm('Вы уверены, что хотите начать заново?')) {
    store.resetCalculation()
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped>
.result-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.result-header {
  text-align: center;
  margin-bottom: 30px;
}

.result-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.result-date {
  color: #666;
  font-size: 14px;
}

.main-result {
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
}

.main-result.eligible {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.main-result.not-eligible {
  background: #ffebee;
  color: #c62828;
}

.result-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.main-result h3 {
  font-size: 22px;
  margin-bottom: 25px;
}

.amount-block {
  background: rgba(255, 255, 255, 0.15);
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.amount-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.amount-value {
  font-size: 36px;
  font-weight: bold;
}

.amount-details {
  margin-top: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin-bottom: 10px;
}

.detail-item.sub-detail {
  background: rgba(255, 255, 255, 0.05);
  margin-left: 20px;
  font-size: 14px;
}

.detail-label {
  opacity: 0.9;
}

.detail-value {
  font-weight: 600;
}

.reasons-block {
  text-align: left;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.reasons-block h4 {
  color: #d32f2f;
  margin-bottom: 15px;
  font-size: 16px;
}

.reasons-list {
  margin: 0;
  padding-left: 20px;
}

.reason-item {
  color: #666;
  margin-bottom: 10px;
  line-height: 1.5;
}

.details-section {
  margin-top: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.check-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.check-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.check-card.success {
  border-color: #4caf50;
  background: #f1f8e9;
}

.check-card.error {
  border-color: #f44336;
  background: #ffebee;
}

.check-card.warning {
  border-color: #ff9800;
  background: #fff3e0;
}

.check-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.check-icon {
  font-size: 24px;
  margin-right: 10px;
}

.check-card.success .check-icon {
  color: #4caf50;
}

.check-card.error .check-icon {
  color: #f44336;
}

.check-card.warning .check-icon {
  color: #ff9800;
}

.check-title {
  font-weight: 600;
  color: #333;
}

.check-value {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.check-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.calculation-steps {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
}

.calc-step {
  display: flex;
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;
}

.calc-step:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.calc-step.bonus {
  background: #fff8e1;
  padding: 15px;
  border-radius: 6px;
  border-bottom: none;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 20px;
  flex-shrink: 0;
}

.calc-step.bonus .step-number {
  background: #ffc107;
  color: #333;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.step-content p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.step-result {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
  font-weight: 600;
  color: #2e7d32;
}

.payment-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.info-card h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.info-card ul {
  margin: 0;
  padding-left: 20px;
}

.info-card li {
  color: #666;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.action-section {
  margin-top: 40px;
}

.action-steps {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
}

.action-item {
  display: flex;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
}

.action-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.action-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  margin-right: 20px;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
}

.action-content h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.action-content ul {
  margin: 0;
  padding-left: 20px;
}

.action-content li {
  color: #666;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.action-content p {
  color: #666;
  font-size: 14px;
  margin: 8px 0;
  line-height: 1.5;
}

.submit-options {
  display: grid;
  gap: 15px;
  margin-top: 15px;
}

.submit-btn {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.submit-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn.secondary {
  background: white;
  color: #333;
  border-color: #e0e0e0;
}

.submit-btn.secondary:hover {
  background: #f5f5f5;
  border-color: #667eea;
}

.btn-icon {
  font-size: 24px;
  margin-right: 15px;
}

.btn-text {
  display: flex;
  flex-direction: column;
}

.btn-text strong {
  font-size: 16px;
  margin-bottom: 4px;
}

.btn-text small {
  font-size: 12px;
  opacity: 0.8;
}

.improvement-tips {
  background: #fff3e0;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #ff9800;
}

.improvement-tips h4 {
  color: #e65100;
  margin: 0 0 15px 0;
  font-size: 16px;
}

.improvement-tips ul {
  margin: 0;
  padding-left: 20px;
}

.improvement-tips li {
  color: #666;
  margin-bottom: 10px;
  line-height: 1.5;
  font-size: 14px;
}

.additional-info {
  margin-top: 40px;
  padding: 25px;
  background: #e3f2fd;
  border-radius: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 6px;
}

.info-item h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
}

.info-item p {
  margin: 5px 0;
  color: #2196f3;
  font-size: 18px;
  font-weight: 600;
}

.info-item small {
  color: #666;
  font-size: 12px;
}

.result-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.action-btn.print {
  background: #4caf50;
  color: white;
}

.action-btn.print:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.action-btn.save {
  background: #2196f3;
  color: white;
}

.action-btn.save:hover {
  background: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.action-btn.restart {
  background: #ff9800;
  color: white;
}

.action-btn.restart:hover {
  background: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

/* Адаптивность */
@media (max-width: 768px) {
  .result-container {
    padding: 15px;
  }
  
  .main-result {
    padding: 20px;
  }
  
  .amount-value {
    font-size: 28px;
  }
  
  .check-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-info {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-item {
    flex-direction: column;
    text-align: center;
  }
  
  .action-number {
    margin: 0 auto 15px;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .result-title {
    font-size: 20px;
  }
  
  .main-result h3 {
    font-size: 18px;
  }
  
  .amount-value {
    font-size: 24px;
  }
  
  .detail-item {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-label {
    margin-bottom: 5px;
  }
}

/* Стили для печати */
@media print {
  .result-actions {
    display: none;
  }
  
  .result-container {
    max-width: 100%;
  }
  
  .main-result {
    break-inside: avoid;
  }
  
  .check-card {
    break-inside: avoid;
  }
  
  .action-section {
    break-inside: avoid;
  }
}
</style>