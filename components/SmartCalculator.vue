<script setup>
import { ref, computed, onMounted } from 'vue'
import { regions, findRegionByCode } from '../data/regions'
import SmartResults from './SmartResults.vue'
import { detectRegionByIP } from '../utils/geoDetection'

// Основные данные формы
const formData = ref({
  region: '',
  recipientType: '', // pregnant, parent, both
  childrenCount: 1,
  hasSpouse: false,
  hasOtherAdults: false,
  otherAdultsCount: 1,
  totalIncome: 0,
  hasValidReason: false,
  propertyCheck: {
    hasMultipleApartments: false,
    hasMultipleCars: false,
    hasLuxuryCar: false,
    hasHighSavings: false
  },
  special: {
    singleParent: false,
    hasDisabled: false,
    mobilized: false
  }
})

// Состояние калькулятора
const currentQuestionIndex = ref(0)
const showResults = ref(false)
const isDetectingRegion = ref(false)
const isAutoDetected = ref(false)
const showIncomeHelp = ref(false)

// Список вопросов (всего 5!)
const questions = ['region', 'recipient', 'family', 'income', 'conditions']

// Вычисляемые свойства
const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const currentQuestionNumber = computed(() => currentQuestionIndex.value + 1)
const totalQuestions = computed(() => questions.length)
const isFirstQuestion = computed(() => currentQuestionIndex.value === 0)
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.length - 1)

// Данные региона
const currentRegion = computed(() => findRegionByCode(formData.value.region))
const currentRegionPM = computed(() => currentRegion.value?.pmValue || 0)

// Расчет состава семьи
const totalFamilyMembers = computed(() => {
  let total = 1 // Заявитель
  if (formData.value.hasSpouse) total += 1
  if (formData.value.hasOtherAdults) total += formData.value.otherAdultsCount
  if (formData.value.recipientType !== 'pregnant') {
    total += formData.value.childrenCount
  }
  return total
})

// Расчет среднедушевого дохода
const averageMonthlyIncome = computed(() => {
  if (totalFamilyMembers.value === 0) return 0
  return Math.round(formData.value.totalIncome / 12 / totalFamilyMembers.value)
})

// Проверка нужна ли проверка нулевого дохода
const needsZeroIncomeCheck = computed(() => {
  return averageMonthlyIncome.value < currentRegionPM.value * 0.3
})

// Статус дохода
const getIncomeStatusClass = () => {
  const percent = (averageMonthlyIncome.value / currentRegionPM.value) * 100
  if (percent <= 100) return 'success'
  return 'error'
}

const incomeStatusText = computed(() => {
  const percent = Math.round((averageMonthlyIncome.value / currentRegionPM.value) * 100)
  if (percent <= 100) {
    return `✓ Доход ${percent}% от ПМ — вы проходите по доходу`
  }
  return `✗ Доход ${percent}% от ПМ — превышает допустимый уровень`
})

// Проверка можно ли продолжить
const canProceed = computed(() => {
  switch (currentQuestion.value) {
    case 'region':
      return !!formData.value.region
    case 'recipient':
      return !!formData.value.recipientType
    case 'family':
      return formData.value.recipientType === 'pregnant' || formData.value.childrenCount > 0
    case 'income':
      return true // Можно оставить 0
    case 'conditions':
      return true // Все чекбоксы необязательные
    default:
      return true
  }
})

// Навигация
const nextQuestion = () => {
  if (isLastQuestion.value) {
    showResults.value = true
  } else {
    currentQuestionIndex.value++
  }
}

const previousQuestion = () => {
  if (!isFirstQuestion.value) {
    currentQuestionIndex.value--
  }
}

const resetCalculator = () => {
  currentQuestionIndex.value = 0
  showResults.value = false
}

// Управление счетчиками
const incrementChildren = () => {
  if (formData.value.childrenCount < 10) formData.value.childrenCount++
}

const decrementChildren = () => {
  if (formData.value.childrenCount > 0) formData.value.childrenCount--
}

const incrementOtherAdults = () => {
  if (formData.value.otherAdultsCount < 5) formData.value.otherAdultsCount++
}

const decrementOtherAdults = () => {
  if (formData.value.otherAdultsCount > 1) formData.value.otherAdultsCount--
}

// Склонения
const getFamilyWord = (count) => {
  if (count === 1) return 'человек'
  if (count >= 2 && count <= 4) return 'человека'
  return 'человек'
}

// Форматирование
const formatAmount = (amount) => {
  return new Intl.NumberFormat('ru-RU').format(amount)
}

// Подготовка данных для расчета
const getCalculationData = () => {
  const region = currentRegion.value
  if (!region) return null
  
  let isEligible = true
  let denialReasons = []
  
  // Проверка 1: Есть ли дети или беременность
  if (formData.value.recipientType === 'parent' && formData.value.childrenCount === 0) {
    isEligible = false
    denialReasons.push('Необходимо иметь детей до 17 лет')
  }
  
  // Проверка 2: Доход
  if (averageMonthlyIncome.value > currentRegionPM.value) {
    isEligible = false
    denialReasons.push(`Среднедушевой доход (${formatAmount(averageMonthlyIncome.value)} ₽) превышает прожиточный минимум региона (${formatAmount(currentRegionPM.value)} ₽)`)
  }
  
  // Проверка 3: Правило нулевого дохода
  if (needsZeroIncomeCheck.value && !formData.value.hasValidReason) {
    isEligible = false
    denialReasons.push('Не указана уважительная причина отсутствия/низкого дохода')
  }
  
  // Проверка 4: Имущество
  if (formData.value.propertyCheck.hasMultipleApartments && !formData.value.special.hasDisabled) {
    isEligible = false
    denialReasons.push('Превышен лимит недвижимости (более одной квартиры)')
  }
  
  if (formData.value.propertyCheck.hasMultipleCars && !formData.value.special.hasDisabled) {
    isEligible = false
    denialReasons.push('Превышен лимит транспорта (более одного автомобиля)')
  }
  
  if (formData.value.propertyCheck.hasLuxuryCar) {
    isEligible = false
    denialReasons.push('Наличие автомобиля премиум-класса (младше 5 лет, мощнее 250 л.с.)')
  }
  
  if (formData.value.propertyCheck.hasHighSavings) {
    isEligible = false
    denialReasons.push('Сбережения превышают годовой прожиточный минимум')
  }
  
  // Расчет размера пособия
  let benefitAmount = 0
  let benefitDetails = []
  
  if (isEligible) {
    const childPM = region.pmChild
    const incomePercent = averageMonthlyIncome.value / currentRegionPM.value
    
    // Определяем процент выплаты (50%, 75% или 100%)
    let benefitPercent = 50
    if (incomePercent <= 0.5) {
      benefitPercent = 100
    } else if (incomePercent <= 0.75) {
      benefitPercent = 75
    }
    
    // Пособие на детей
    if (formData.value.childrenCount > 0) {
      const benefitPerChild = Math.round(childPM * (benefitPercent / 100))
      const totalChildBenefit = benefitPerChild * formData.value.childrenCount
      benefitAmount += totalChildBenefit
      
      benefitDetails.push({
        type: 'children',
        count: formData.value.childrenCount,
        amountPerChild: benefitPerChild,
        total: totalChildBenefit,
        percent: benefitPercent
      })
    }
    
    // Пособие беременным
    if (formData.value.recipientType === 'pregnant' || formData.value.recipientType === 'both') {
      const pregnantBenefit = Math.round(currentRegionPM.value * (benefitPercent / 100))
      benefitAmount += pregnantBenefit
      
      benefitDetails.push({
        type: 'pregnancy',
        amount: pregnantBenefit,
        percent: benefitPercent
      })
    }
  }
  
  return {
    isEligible,
    denialReasons,
    benefitAmount,
    benefitDetails,
    formData: formData.value,
    regionData: region,
    calculations: {
      totalFamilyMembers: totalFamilyMembers.value,
      totalChildren: formData.value.childrenCount,
      totalYearlyIncome: formData.value.totalIncome,
      averageMonthlyIncome: averageMonthlyIncome.value,
      incomePercent: Math.round((averageMonthlyIncome.value / currentRegionPM.value) * 100)
    }
  }
}

// Автоопределение региона
onMounted(async () => {
  if (!formData.value.region) {
    isDetectingRegion.value = true
    
    try {
      const detectedRegion = await detectRegionByIP()
      if (detectedRegion) {
        formData.value.region = detectedRegion
        isAutoDetected.value = true
      }
    } catch (error) {
      console.error('Ошибка определения региона:', error)
    } finally {
      isDetectingRegion.value = false
    }
  }
})
</script>

<template>
  <div class="smart-calculator">
    <div class="container">
      <!-- Основной контент -->
      <div class="content base-bg-color-two">
        <!-- Прогресс -->
        <div class="progress" v-if="!showResults">
          <div class="progress-numbers">
            <p class="one">{{ currentQuestionNumber }}</p>
            <p class="dop">/</p>
            <p class="two">{{ totalQuestions }}</p>
          </div>
          <p class="more">вопрос {{ currentQuestionNumber }} из {{ totalQuestions }}</p>
        </div>

        <!-- Вопросы -->
        <div v-if="!showResults" class="question-section">
          <!-- Шаг 1: Регион -->
          <div v-if="currentQuestion === 'region'" class="region-step">
            <h2 class="step-title dark-text">Где вы проживаете?</h2>
            <p class="step-description light-text">
              От региона зависит размер прожиточного минимума и сумма пособия
            </p>
            <div class="base-option">
              <div class="select-wrapper">
                <select v-model="formData.region" class="region-select">
                  <option disabled value="">Выберите регион</option>
                  <option v-for="region in regions" :key="region.code" :value="region.code">
                    {{ region.name }} (ПМ: {{ formatAmount(region.pmValue) }} ₽)
                  </option>
                </select>
              </div>
              <div v-if="isDetectingRegion" class="loading-message light-text">
                <div class="spinner"></div>
                Определяем ваш регион...
              </div>
              <div v-if="formData.region && isAutoDetected" class="success-message">
                ✓ Регион определен автоматически
              </div>
            </div>
          </div>

          <!-- Шаг 2: Кто получатель -->
          <div v-if="currentQuestion === 'recipient'" class="recipient-step">
            <h2 class="step-title dark-text">Кто будет получать пособие?</h2>
            <p class="step-description light-text">
              Единое пособие могут получить беременные женщины и родители детей до 17 лет
            </p>
            
            <div class="recipient-options">
              <label class="option-card" :class="{ 'selected': formData.recipientType === 'pregnant' }">
                <input type="radio" v-model="formData.recipientType" value="pregnant" />
                <div class="option-content">
                  <div class="option-icon">🤰</div>
                  <div class="option-text">
                    <h3>Беременная женщина</h3>
                    <p>Срок от 6 недель, встала на учет до 12 недель</p>
                  </div>
                </div>
              </label>

              <label class="option-card" :class="{ 'selected': formData.recipientType === 'parent' }">
                <input type="radio" v-model="formData.recipientType" value="parent" />
                <div class="option-content">
                  <div class="option-icon">👨‍👩‍👧‍👦</div>
                  <div class="option-text">
                    <h3>Родитель с детьми</h3>
                    <p>Дети до 17 лет</p>
                  </div>
                </div>
              </label>

              <label class="option-card" :class="{ 'selected': formData.recipientType === 'both' }">
                <input type="radio" v-model="formData.recipientType" value="both" />
                <div class="option-content">
                  <div class="option-icon">👶</div>
                  <div class="option-text">
                    <h3>Беременная с детьми</h3>
                    <p>Беременная женщина, у которой уже есть дети</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Шаг 3: Состав семьи -->
          <div v-if="currentQuestion === 'family'" class="family-step">
            <h2 class="step-title dark-text">Состав вашей семьи</h2>
            <p class="step-description light-text">
              Укажите всех членов семьи, проживающих вместе
            </p>
            
            <div class="family-grid">
              <!-- Дети до 17 лет (если не только беременная) -->
              <div v-if="formData.recipientType !== 'pregnant'" class="family-block">
                <h3 class="block-title">Дети до 17 лет</h3>
                <div class="counter-row">
                  <label>Количество детей:</label>
                  <div class="input-numbers">
                    <button class="minus" @click="decrementChildren" :disabled="formData.childrenCount <= 0">
                      <svg width="15" height="3" viewBox="0 0 15 3" fill="none">
                        <path d="M13.4229 0.258179H1.61236C0.916792 0.258179 0.352936 0.822035 0.352936 1.5176C0.352936 2.21316 0.916792 2.77702 1.61236 2.77702H13.4229C14.1185 2.77702 14.6823 2.21316 14.6823 1.5176C14.6823 0.822035 14.1185 0.258179 13.4229 0.258179Z" fill="white"/>
                      </svg>
                    </button>
                    <input type="number" v-model.number="formData.childrenCount" min="0" max="10" class="number-input" />
                    <button class="plus" @click="incrementChildren">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M13.4229 6.25819H8.77706V1.61233C8.77706 0.916762 8.21321 0.352905 7.51764 0.352905C6.82208 0.352905 6.25822 0.916762 6.25822 1.61233V6.25819H1.61236C0.916793 6.25819 0.352936 6.82205 0.352936 7.51761C0.352936 8.21318 0.916793 8.77703 1.61236 8.77703H6.25822V13.4229C6.25822 14.1185 6.82208 14.6823 7.51764 14.6823C8.21321 14.6823 8.77706 14.1185 8.77706 13.4229V8.77703H13.4229C14.1185 8.77703 14.6823 8.21318 14.6823 7.51761C14.6823 6.82205 14.1185 6.25819 13.4229 6.25819Z" fill="white"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="hint-text light-text">
                  Пособие назначается на каждого ребенка до 17 лет
                </p>
              </div>

              <!-- Взрослые -->
              <div class="family-block">
                <h3 class="block-title">Взрослые члены семьи</h3>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.hasSpouse" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Есть супруг(а)</span>
                </label>

                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.hasOtherAdults" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Другие взрослые (родители, взрослые дети)</span>
                </label>
                
                <div v-if="formData.hasOtherAdults" class="counter-row">
                  <label>Сколько других взрослых:</label>
                  <div class="input-numbers">
                    <button class="minus" @click="decrementOtherAdults" :disabled="formData.otherAdultsCount <= 1">
                      <svg width="15" height="3" viewBox="0 0 15 3" fill="none">
                        <path d="M13.4229 0.258179H1.61236C0.916792 0.258179 0.352936 0.822035 0.352936 1.5176C0.352936 2.21316 0.916792 2.77702 1.61236 2.77702H13.4229C14.1185 2.77702 14.6823 2.21316 14.6823 1.5176C14.6823 0.822035 14.1185 0.258179 13.4229 0.258179Z" fill="white"/>
                      </svg>
                    </button>
                    <input type="number" v-model.number="formData.otherAdultsCount" min="1" max="5" class="number-input" />
                    <button class="plus" @click="incrementOtherAdults" :disabled="formData.otherAdultsCount >= 5">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M13.4229 6.25819H8.77706V1.61233C8.77706 0.916762 8.21321 0.352905 7.51764 0.352905C6.82208 0.352905 6.25822 0.916762 6.25822 1.61233V6.25819H1.61236C0.916793 6.25819 0.352936 6.82205 0.352936 7.51761C0.352936 8.21318 0.916793 8.77703 1.61236 8.77703H6.25822V13.4229C6.25822 14.1185 6.82208 14.6823 7.51764 14.6823C8.21321 14.6823 8.77706 14.1185 8.77706 13.4229V8.77703H13.4229C14.1185 8.77703 14.6823 8.21318 14.6823 7.51761C14.6823 6.82205 14.1185 6.25819 13.4229 6.25819Z" fill="white"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Итоговый состав -->
            <div class="family-summary">
              <p class="summary-text">
                <strong>Всего в семье: {{ totalFamilyMembers }} {{ getFamilyWord(totalFamilyMembers) }}</strong>
              </p>
              <p class="hint-text light-text">
                Доход будет делиться на {{ totalFamilyMembers }} для расчета среднедушевого дохода
              </p>
            </div>
          </div>

          <!-- Шаг 4: Доход семьи (упрощенный) -->
          <div v-if="currentQuestion === 'income'" class="income-step">
            <h2 class="step-title dark-text">Общий доход вашей семьи</h2>
            <p class="step-description light-text">
              Укажите суммарный доход всех членов семьи за последние 12 месяцев
            </p>
            
            <div class="income-input-block">
              <label>Общий доход за год (все источники):</label>
              <div class="big-input-wrapper">
                <input 
                  type="number" 
                  v-model.number="formData.totalIncome" 
                  placeholder="Например: 600000"
                  class="big-income-input"
                />
                <span class="currency">₽</span>
              </div>
              <p class="hint-text light-text">
                Включите: зарплаты, пенсии, пособия, алименты, доходы от бизнеса и аренды
              </p>
            </div>

            <!-- Быстрый расчет -->
            <div class="income-calculator-preview">
              <div class="calc-row">
                <span>Среднедушевой доход в месяц:</span>
                <span class="calc-value" :class="getIncomeStatusClass()">
                  {{ formatAmount(averageMonthlyIncome) }} ₽
                </span>
              </div>
              <div class="calc-row">
                <span>Прожиточный минимум в вашем регионе:</span>
                <span class="calc-value">{{ formatAmount(currentRegionPM) }} ₽</span>
              </div>
              <div class="income-status" :class="getIncomeStatusClass()">
                {{ incomeStatusText }}
              </div>
            </div>

            <!-- Помощь с расчетом -->
            <div class="help-block">
              <button @click="showIncomeHelp = !showIncomeHelp" class="help-toggle">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7.5" stroke="#008CFF"/>
                  <path d="M8 12V12.01M8 4C7 4 6 4.5 6 6C6 7.5 8 7.5 8 9" stroke="#008CFF" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Как посчитать доход?
              </button>
              
              <div v-if="showIncomeHelp" class="help-content">
                <h4>Что включать в доход:</h4>
                <ul>
                  <li>Зарплаты до вычета налогов</li>
                  <li>Премии, отпускные, больничные</li>
                  <li>Пенсии и социальные выплаты</li>
                  <li>Стипендии</li>
                  <li>Алименты полученные</li>
                  <li>Доходы от предпринимательства</li>
                  <li>Доходы от сдачи имущества в аренду</li>
                </ul>
                <h4>Что НЕ включать:</h4>
                <ul>
                  <li>Единовременные выплаты в связи с ЧС</li>
                  <li>Региональный маткапитал</li>
                  <li>Налоговые вычеты</li>
                  <li>Компенсации за вред здоровью</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Шаг 5: Основные условия -->
          <div v-if="currentQuestion === 'conditions'" class="conditions-step">
            <h2 class="step-title dark-text">Проверка дополнительных условий</h2>
            <p class="step-description light-text">
              Ответьте на вопросы для точного расчета
            </p>
            
            <div class="conditions-list">
              <!-- Правило нулевого дохода -->
              <div class="condition-block" v-if="needsZeroIncomeCheck">
                <h3 class="condition-title">
                  ⚠️ Обнаружен низкий доход
                </h3>
                <p class="condition-desc light-text">
                  Все трудоспособные члены семьи должны иметь доход или уважительную причину его отсутствия
                </p>
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.hasValidReason" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">
                    Есть уважительная причина отсутствия дохода
                    <span class="hint-inline">(уход за ребенком до 3 лет, инвалидом, учеба, беременность, безработица до 6 мес.)</span>
                  </span>
                </label>
              </div>

              <!-- Имущество -->
              <div class="condition-block">
                <h3 class="condition-title">
                  🏠 Проверка имущества
                </h3>
                <p class="condition-desc light-text">
                  Семья должна соответствовать имущественным критериям
                </p>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.propertyCheck.hasMultipleApartments" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">У семьи более одной квартиры</span>
                </label>

                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.propertyCheck.hasMultipleCars" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">У семьи более одного автомобиля</span>
                </label>

                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.propertyCheck.hasLuxuryCar" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Есть автомобиль младше 5 лет мощнее 250 л.с.</span>
                </label>

                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.propertyCheck.hasHighSavings" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Вклады превышают годовой прожиточный минимум</span>
                </label>
              </div>

              <!-- Особые обстоятельства -->
              <div class="condition-block">
                <h3 class="condition-title">
                  ✨ Особые обстоятельства
                </h3>
                <p class="condition-desc light-text">
                  Отметьте, если что-то из этого относится к вашей семье
                </p>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.special.singleParent" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Единственный родитель</span>
                </label>

                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.special.hasDisabled" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">В семье есть инвалид</span>
                </label>

                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.special.mobilized" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Член семьи мобилизован</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Результаты -->
        <SmartResults 
          v-if="showResults"
          :calculationData="getCalculationData()"
          @recalculate="resetCalculator"
        />
      </div>

      <!-- Кнопки управления -->
      <div class="controls base-bg-color-two" v-if="!showResults">
        <button 
          class="big-button" 
          @click="previousQuestion"
          :disabled="isFirstQuestion"
        >
          Назад
        </button>
        
        <button 
          class="big-button primary"
          @click="nextQuestion"
          :disabled="!canProceed"
        >
          {{ isLastQuestion ? 'Получить результат' : 'Далее' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.smart-calculator {
  width: 100%;
  max-width: 100%;
}

.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  @media(max-width: 768px) {
    padding: 10px;
  }
}

.header {
  padding: 20px;
  border-radius: 14.5px;
  margin-bottom: 20px;
  
  h1 {
    font-size: 22px;
    margin: 0;
    line-height: 1.4;
    font-weight: 600;
  }
}

.content {
  padding: 20px;
  border-radius: 14.5px;
  margin-bottom: 20px;
  flex-grow: 1;
}

// Прогресс бар
.progress {
  margin-bottom: 30px;
  
  .progress-numbers {
    display: flex;
    gap: 2.5px;
    background-color: white;
    justify-content: center;
    align-items: center;
    height: 47px;
    width: 69px;
    border-radius: 15px;
    position: relative;
    -webkit-box-shadow: 0px 0px 3px 1px rgba(0, 97, 206, 0.06);
    -moz-box-shadow: 0px 0px 3px 1px rgba(0, 97, 206, 0.06);
    box-shadow: 0px 0px 3px 1px rgba(0, 97, 206, 0.06);
    &::before {
      content: '';
      position: absolute;
      top: 5px;
      right: 5px;
      bottom: 5px;
      left: 5px;
      border: 1px solid #9CE1FF;
      border-radius: 10px;
    }
    
    p {
      font-size: 23px;
      margin: 0;
      line-height: 1;
    }
    
    .one {
      color: #00B93E;
    }
  }
  
  .more {
    margin-top: 5px;
    font-size: 15px;
    color: #A2AAB5;
  }
}

// Заголовки шагов
.step-title {
  font-weight: 300;
  font-size: 26px;
  letter-spacing: 1.02px;
  line-height: 1.2;
  margin-bottom: 10px;
}

.step-description {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 25px;
  opacity: 0.8;
}

// Селект региона
.select-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
}

.region-select {
  width: 100%;
  padding: 14px 40px 14px 14px;
  border: 1px solid #C4C2FF;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23008CFF' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  &:focus {
    outline: none;
    border-color: #008CFF;
    box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.1);
  }
}

// Карточки выбора получателя
.recipient-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-card {
  display: block;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #008CFF;
    background: #f8fbff;
  }
  
  &.selected {
    border-color: #008CFF;
    background: #e3f2fd;
  }
  
  input[type="radio"] {
    display: none;
  }
  
  .option-content {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  .option-icon {
    font-size: 32px;
    flex-shrink: 0;
  }
  
  .option-text {
    h3 {
      margin: 0 0 5px 0;
      font-size: 18px;
      color: #2C3E50;
    }
    
    p {
      margin: 0;
      font-size: 14px;
      color: #7d838b;
    }
  }
}

// Блоки семьи
.family-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
}

.family-block {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  
  .block-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #2C3E50;
  }
}

.counter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px 0;
  
  label {
    font-size: 16px;
    color: #2C3E50;
  }
}

// Счетчики
.input-numbers {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .number-input {
    width: 60px;
    height: 38px;
    border: 1px solid #C4C2FF;
    border-radius: 5px;
    text-align: center;
    font-size: 17px;
    -moz-appearance: textfield;
    appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    &:focus {
      outline: none;
      border-color: #008CFF;
    }
  }
  
  .minus, .plus {
    width: 32px;
    height: 32px;
    background-color: #008CFF;
    display: flex;
    border: none;
    border-radius: 7px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover:not(:disabled) {
      background-color: #0070d2;
    }
    
    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }
}

// Чекбоксы
.custom-checkbox {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 15px;
  padding-left: 30px;
  position: relative;
  
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
    top: 2px;
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
    }
  }
  
  .checkbox-text {
    line-height: 1.4;
    margin-left: 5px;
    
    .hint-inline {
      display: block;
      font-size: 14px;
      color: #7d838b;
      margin-top: 5px;
    }
  }
}

// Итог семьи
.family-summary {
  padding: 15px;
  background: #e3f2fd;
  border-radius: 8px;
  text-align: center;
  
  .summary-text {
    margin: 0 0 5px 0;
    font-size: 18px;
  }
  
  .hint-text {
    margin: 0;
    font-size: 14px;
  }
}

// Ввод дохода
.income-input-block {
  margin-bottom: 25px;
  
  label {
    display: block;
    margin-bottom: 10px;
    font-size: 16px;
    color: #2C3E50;
  }
}

.big-input-wrapper {
  position: relative;
  
  .big-income-input {
    width: 100%;
    padding: 16px 40px 16px 16px;
    border: 2px solid #C4C2FF;
    border-radius: 10px;
    font-size: 24px;
    font-weight: 600;
    color: #2C3E50;
    
    &:focus {
      outline: none;
      border-color: #008CFF;
      box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.1);
    }
  }
  
  .currency {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24px;
    color: #7d838b;
  }
}

.hint-text {
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
}

// Предпросмотр расчета
.income-calculator-preview {
  padding: 20px;
  background: linear-gradient(135deg, #f0f4ff, #fff);
  border-radius: 10px;
  border: 1px solid #C4C2FF;
  margin-bottom: 20px;
  
  .calc-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    
    .calc-value {
      font-weight: 600;
      
      &.success {
        color: #00B93E;
      }
      
      &.error {
        color: #FF4444;
      }
    }
  }
  
  .income-status {
    margin-top: 15px;
    padding: 10px;
    border-radius: 6px;
    text-align: center;
    font-weight: 500;
    
    &.success {
      background: #00B93E20;
      color: #00B93E;
    }
    
    &.error {
      background: #FF444420;
      color: #FF4444;
    }
  }
}

// Блок помощи
.help-block {
  margin-top: 20px;
  
  .help-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    background: white;
    border: 1px solid #C4C2FF;
    border-radius: 8px;
    color: #008CFF;
    font-size: 15px;
    cursor: pointer;
    
    &:hover {
      background: #f8fbff;
    }
  }
  
  .help-content {
    margin-top: 15px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    
    h4 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #2C3E50;
    }
    
    ul {
      margin: 0 0 15px 0;
      padding-left: 20px;
      
      li {
        margin-bottom: 5px;
        font-size: 14px;
        color: #7d838b;
      }
    }
  }
}

// Блоки условий
.conditions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.condition-block {
  padding: 20px;
  background: #fafbfc;
  border-radius: 10px;
  
  .condition-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #2C3E50;
  }
  
  .condition-desc {
    font-size: 14px;
    margin-bottom: 15px;
  }
}

// Сообщения
.loading-message {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 14px;
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #C4C2FF;
    border-top-color: #008CFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  margin-top: 10px;
  padding: 10px;
  background-color: #e8f5e9;
  border-radius: 6px;
  color: #2e7d32;
  font-size: 14px;
}

// Кнопки управления
.controls {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 20px;
  border-radius: 14.5px;
  width: 100%;
}

.big-button {
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  background: #f5f5f5;
  color: #333;
  
  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.primary {
    background: #008CFF;
    color: white;
    
    &:hover:not(:disabled) {
      background: #0070d2;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .step-title {
    font-size: 22px;
  }
  
  .recipient-options {
    .option-icon {
      font-size: 28px;
    }
    
    .option-text h3 {
      font-size: 16px;
    }
  }
  
  .big-income-input {
    font-size: 20px !important;
  }
  
  .controls {
    flex-direction: column;
    
    .big-button {
      width: 100%;
    }
  }
}
</style>