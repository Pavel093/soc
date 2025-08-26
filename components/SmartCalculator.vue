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
                  <div class="option-icon"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#f1d0a5" d="m275.758 447.696-3.162 12.331-7.14 27.867-30.029 12.104.329-13.34.649-26.631.433-17.564.422-17.379z" opacity="1" data-original="#f1d0a5"></path><path fill="#f1b986" d="M235.43 429.085h13.934v62.121H235.43z" opacity="1" data-original="#f1b986"></path><path fill="#63afcb" d="M291.69 512h-56.26v-24.108h32.152c13.314 0 24.108 10.794 24.108 24.108z" opacity="1" data-original="#63afcb"></path><path fill="#f1d0a5" d="m245.739 447.696-3.163 12.331-6.82 26.631-.319 1.236-30.03 12.104.979-39.971.855-34.943 29.597 17.379z" opacity="1" data-original="#f1d0a5"></path><path fill="#f1b986" d="M205.408 429.085h13.934v62.121h-13.934z" opacity="1" data-original="#f1b986"></path><path fill="#70c6da" d="M261.667 512h-56.259v-24.108h32.152c13.314 0 24.107 10.794 24.107 24.108z" opacity="1" data-original="#70c6da"></path><path fill="#e27d47" d="M405.345 252.425s-28.773 31.73-100.556 24.673H176.583c-71.793 7.057-100.566-24.673-100.566-24.673 16.957-16.957 16.442-53.435 16.442-118.182S118.152 0 240.681 0s148.222 69.496 148.222 134.243-.514 101.226 16.442 118.182z" opacity="1" data-original="#e27d47"></path><path fill="#dd542e" d="M191.212 132.409v144.689h-14.629c-71.793 7.057-100.566-24.673-100.566-24.673 16.957-16.957 16.442-53.435 16.442-118.182S118.152 0 240.681 0c-56.752 0-49.469 75.08-49.469 132.409z" opacity="1" data-original="#dd542e"></path><path fill="#f1b986" d="m275.758 447.696-3.162 12.331h-66.21l.855-34.943 29.597 17.379.422-17.379z" opacity="1" data-original="#f1b986"></path><path fill="#8078bc" d="M337.816 447.696H172.349s20.552-133.882 5.419-187.297l56.258.536 64.737.618c5.161 11.971 6.336 22.489 5.831 30.895-.803 13.351-5.831 21.366-5.831 21.366s47.79 2.575 59.091 53.961c11.311 51.385-20.038 79.921-20.038 79.921z" opacity="1" data-original="#8078bc"></path><path fill="#5e54ac" d="M275.759 447.696h-103.41s20.552-133.882 5.419-187.297l56.258.536c5.419 8.54 29.401 49.912 9.241 84.743 0-.001-23.641 62.692 32.492 102.018z" opacity="1" data-original="#5e54ac"></path><path fill="#f1b986" d="M303.716 277.882c-37.025 26.455-86.01-14.371-86.01-14.371l-1.319-2.74 82.373.783c2.504 5.81 4.07 11.27 4.956 16.328z" opacity="1" data-original="#f1b986"></path><path fill="#f1d0a5" d="M346.687 206.222c-1.556 30.586-26.033 54.94-56.639 56.382a1049.547 1049.547 0 0 1-72.236.917c-.031 0-.072 0-.103-.01a1020.1 1020.1 0 0 1-26.393-.907c-30.596-1.442-55.074-25.796-56.639-56.382a717.263 717.263 0 0 1-.371-65.386h.01s25.147-1.277 56.897-8.427c28.217-6.346 61.646-17.338 87.267-36.19 0 0 26.723 44.617 68.579 44.617a714.034 714.034 0 0 1-.372 65.386z" opacity="1" data-original="#f1d0a5"></path><path fill="#f1b986" d="M217.708 263.51a1020.1 1020.1 0 0 1-26.393-.907c-30.596-1.442-55.074-25.796-56.639-56.382a717.263 717.263 0 0 1-.371-65.386h.01s25.147-1.277 56.897-8.427v.01c-7.088 60.782.082 130 26.496 131.092z" opacity="1" data-original="#f1b986"></path><path fill="#da4a54" d="M240.684 218.768c-12.21 0-23.482-7.129-28.718-18.161a7.727 7.727 0 0 1 13.961-6.625c2.691 5.67 8.483 9.334 14.757 9.334s12.066-3.664 14.758-9.334a7.726 7.726 0 1 1 13.96 6.626c-5.237 11.032-16.509 18.16-28.718 18.16z" opacity="1" data-original="#da4a54"></path><path fill="#454045" d="M191.217 146.628c-5.353 0-9.708 6.475-9.708 14.433 0 7.959 4.355 14.433 9.708 14.433s9.708-6.475 9.708-14.433c-.001-7.958-4.355-14.433-9.708-14.433zM290.152 146.628c-5.352 0-9.707 6.475-9.707 14.433 0 7.959 4.355 14.433 9.707 14.433 5.353 0 9.708-6.475 9.708-14.433.001-7.958-4.355-14.433-9.708-14.433z" opacity="1" data-original="#454045"></path><ellipse cx="306.801" cy="190.766" fill="#eaac9d" rx="15.759" ry="9.935" opacity="1" data-original="#eaac9d"></ellipse><ellipse cx="174.566" cy="190.766" fill="#eaac9d" rx="15.759" ry="9.935" opacity="1" data-original="#eaac9d"></ellipse><path fill="#f1d0a5" d="M284.392 349.752c-5.139-15.416-39.054-13.36-39.054-13.36-22.123 0-31.49-16.401-32.771-35.66-.576-8.656-6.568-16.151-15.067-17.891-12.232-2.504-23.075 6.788-23.075 18.668v9.296c0 9.889 2.292 19.706 7.103 28.346 19.339 34.726 63.81 28.073 63.81 28.073s44.192-2.056 39.054-17.472z" opacity="1" data-original="#f1d0a5"></path><path fill="#f1b986" d="M283.393 356.242c-7.036 9.529-38.055 10.982-38.055 10.982s-44.474 6.646-63.814-28.075c-4.812-8.64-7.104-18.458-7.104-28.348v-9.293c0-10.034 7.726-18.214 17.492-19.017a18.901 18.901 0 0 0-4.121 11.827v17.42c10.941 57.268 70.907 48.295 70.907 48.295s13.486-.628 24.695-3.791z" opacity="1" data-original="#f1b986"></path><ellipse cx="348.101" cy="344.928" fill="#f1d0a5" rx="14.379" ry="22.32" transform="rotate(-30 348.08 344.94)" opacity="1" data-original="#f1d0a5"></ellipse><path fill="#f1b986" d="M360.033 363.769c-.247.175-.505.34-.773.494-6.882 3.966-17.451-1.473-23.612-12.146s-5.584-22.551 1.288-26.517c3.4-1.968 7.695-1.628 11.919.494-6.15 4.378-6.459 15.762-.536 26.022 3.122 5.41 7.387 9.469 11.714 11.653z" opacity="1" data-original="#f1b986"></path><g fill="#da4a54"><path d="M382 316.407a7.727 7.727 0 0 1-6.619-11.703l12.333-20.555a7.727 7.727 0 0 1 13.252 7.951l-12.333 20.555a7.722 7.722 0 0 1-6.633 3.752zM398.447 340.046a7.729 7.729 0 0 1-2.051-15.177l29.804-8.222a7.724 7.724 0 0 1 9.502 5.394 7.727 7.727 0 0 1-5.393 9.503l-29.804 8.222a7.75 7.75 0 0 1-2.058.28zM419.004 378.085a7.704 7.704 0 0 1-2.749-.508l-21.583-8.222a7.726 7.726 0 1 1 5.501-14.441l21.583 8.222a7.726 7.726 0 0 1-2.752 14.949z" fill="#da4a54" opacity="1" data-original="#da4a54"></path></g><path fill="#5e54ac" d="M304.593 292.448c-.803 13.351-5.831 21.366-5.831 21.366-6.727 15.082-48.357 11.579-48.357 11.579s46.997-18.141 54.177-32.935c.001 0 .001-.01.011-.01z" opacity="1" data-original="#5e54ac"></path></g></svg></div>
                  <div class="option-text">
                    <h3>Беременная женщина</h3>
                    <p>Срок от 6 недель, встала на учет до 12 недель</p>
                  </div>
                </div>
              </label>

              <label class="option-card" :class="{ 'selected': formData.recipientType === 'parent' }">
                <input type="radio" v-model="formData.recipientType" value="parent" />
                <div class="option-content">
                  <div class="option-icon"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#ffb983" d="M19.96 435.375s-8.457 61.628 41.293 76.336H205.63c49.75-14.708 41.293-76.336 41.293-76.336L135.57 397.899z" opacity="1" data-original="#ffb983"></path><path fill="#fcd0a3" d="M151.075 397.903h-35.266c-15.795 0-28.599-12.804-28.599-28.599v-42.82h92.465v42.82c0 15.795-12.805 28.599-28.6 28.599z" opacity="1" data-original="#fcd0a3"></path><path fill="#ffb983" d="M242.515 272.409h.153c13.116 0 23.744-10.637 23.744-23.744 0-13.116-10.628-23.753-23.744-23.753-.171 0-.341 0-.512.009H24.728c-.171-.009-.341-.009-.512-.009-13.116 0-23.744 10.637-23.744 23.753 0 13.107 10.628 23.744 23.744 23.744h.153" opacity="1" data-original="#ffb983"></path><path fill="#ec6161" d="M179.675 349.561s67.249 8.455 67.249 40.684v45.13H205.63v76.336H61.253v-76.336H19.96v-45.13c0-32.228 67.249-40.684 67.249-40.684" opacity="1" data-original="#ec6161" class=""></path><path fill="#d63030" d="M93.185 511.714H61.26v-76.336h-41.3v-45.132c0-32.224 67.25-40.682 67.25-40.682h15.484l.742.577C87.21 350.14 65 403.029 93.185 511.714z" opacity="1" data-original="#d63030"></path><path fill="#fcd0a3" d="M179.671 365.762v3.545c0 15.797-12.798 28.596-28.596 28.596h-15.498c-15.787 0-28.596-12.798-28.596-28.596v-2.875c24.227.608 48.464.382 72.69-.67z" opacity="1" data-original="#fcd0a3"></path><path fill="#ffb983" d="M179.674 326.488v39.281l-.01-.01a1062.068 1062.068 0 0 1-72.689.67v2.875c0 15.797 12.809 28.596 28.596 28.596h-19.764c-15.787 0-28.596-12.798-28.596-28.596v-42.816z" opacity="1" data-original="#ffb983"></path><path fill="#fcd0a3" d="M237.053 162.906a1071.173 1071.173 0 0 0-207.222 0c-5.36 42.948-6.939 85.895-4.736 128.843 1.603 31.264 26.621 56.148 57.89 57.625a1069.407 1069.407 0 0 0 100.914 0c31.27-1.476 56.287-26.361 57.89-57.625 2.203-42.947.625-85.895-4.736-128.843z" opacity="1" data-original="#fcd0a3"></path><path fill="#ffb983" d="M29.835 162.899a1072.78 1072.78 0 0 1 103.614-5.018c-17.487 0-34.974 1.69-52.461 5.07a1472.953 1472.953 0 0 0-2.401 130.076c.732 28.534 11.16 51.802 24.845 57.109-6.811-.185-13.633-.443-20.445-.763-31.264-1.474-56.284-26.359-57.892-57.624-2.195-42.95-.618-85.9 4.74-128.85z" opacity="1" data-original="#ffb983"></path><path fill="#e7ab8a" d="M133.442 302.07c-12.413 0-23.874-7.247-29.197-18.464a7.726 7.726 0 0 1 3.667-10.293 7.725 7.725 0 0 1 10.293 3.667c2.779 5.855 8.76 9.637 15.237 9.637 6.478 0 12.458-3.783 15.236-9.637a7.727 7.727 0 0 1 13.961 6.625c-5.323 11.217-16.783 18.465-29.197 18.465z" opacity="1" data-original="#e7ab8a"></path><path fill="#3c5959" d="M241.573 205.676c-22.052 22.062-65.723-22.052-65.723-22.052 1.237 7.986-1.01 15.766-9.666 21.949-6.131 4.379-13.066 6.306-20.249 6.595-28.781 1.154-61.406-24.154-61.406-24.154-5.812 15.983-22.959 15.663-37.169 12.16-13.077-3.225-24.123-11.881-30.43-23.783-10.84-20.456-25.534-55.059-10.551-70.042 21.949-21.949 49.174 0 49.174 0s26.442-9.923 60.19-16.951c.01 0 .031-.01.041-.01 40.384-8.409 91.217-12.695 119.771 9.068 29.471 22.464 28.08 85.168 6.018 107.22z" opacity="1" data-original="#3c5959"></path><path fill="#394949" d="M145.935 212.168c-28.781 1.154-61.406-24.154-61.406-24.154-5.812 15.983-22.959 15.663-37.169 12.16-13.077-3.225-24.123-11.881-30.43-23.783-10.84-20.456-25.534-55.059-10.551-70.042 21.949-21.949 49.174 0 49.174 0s26.442-9.923 60.19-16.951c-43.631 11.459-7.863 109.106 30.192 122.77z" opacity="1" data-original="#394949"></path><path fill="#fcb143" d="M456.653 291.752c47.29 0 48.633 59.287 55.347 78.087 0 0-50.834-8.822-66.71-45.704" opacity="1" data-original="#fcb143"></path><path fill="#ffb983" d="M234.822 435.378s-8.457 61.628 41.293 76.336h144.376c49.75-14.708 41.293-76.336 41.293-76.336l-111.353-37.476z" opacity="1" data-original="#ffb983"></path><path fill="#fcd0a3" d="M365.937 397.905h-35.266c-15.795 0-28.599-12.804-28.599-28.599v-42.82h92.465v42.82c-.001 15.795-12.805 28.599-28.6 28.599z" opacity="1" data-original="#fcd0a3"></path><path fill="#ffb983" d="M457.377 272.412h.153c13.116 0 23.744-10.637 23.744-23.744 0-13.116-10.628-23.753-23.744-23.753-.171 0-.341 0-.512.009H239.59c-.171-.009-.341-.009-.512-.009-13.116 0-23.744 10.637-23.744 23.753 0 13.107 10.628 23.744 23.744 23.744h.153" opacity="1" data-original="#ffb983"></path><path fill="#0a93a3" d="M461.789 390.244v45.132h-41.3v76.336h-144.37v-76.336h-41.3v-45.132c0-32.224 67.25-40.682 67.25-40.682h92.469c.001 0 67.251 8.458 67.251 40.682z" opacity="1" data-original="#0a93a3"></path><path fill="#046b74" d="M308.045 511.713H276.12v-76.336h-41.3v-45.132c0-32.224 67.25-40.682 67.25-40.682h15.484l.742.577c-16.226-.001-38.437 52.889-10.251 161.573z" opacity="1" data-original="#046b74"></path><path fill="#fcd0a3" d="M394.533 365.765v3.545c0 15.797-12.798 28.596-28.596 28.596h-15.498c-15.787 0-28.596-12.798-28.596-28.596v-2.875c24.227.608 48.463.381 72.69-.67z" opacity="1" data-original="#fcd0a3"></path><path fill="#ffb983" d="M394.536 326.49v39.281l-.01-.01a1062.068 1062.068 0 0 1-72.689.67v2.875c0 15.797 12.809 28.596 28.596 28.596h-19.764c-15.787 0-28.596-12.798-28.596-28.596V326.49z" opacity="1" data-original="#ffb983"></path><path fill="#fcd0a3" d="M451.915 162.909a1071.173 1071.173 0 0 0-207.222 0c-5.36 42.948-6.939 85.895-4.736 128.843 1.603 31.264 26.621 56.148 57.89 57.625a1069.407 1069.407 0 0 0 100.914 0c31.27-1.476 56.287-26.361 57.891-57.625 2.202-42.948.623-85.896-4.737-128.843z" opacity="1" data-original="#fcd0a3"></path><path fill="#ffb983" d="M244.697 162.902a1072.78 1072.78 0 0 1 103.614-5.018c-17.487 0-34.974 1.69-52.461 5.07a1472.953 1472.953 0 0 0-2.401 130.076c.732 28.534 11.16 51.802 24.845 57.109-6.811-.185-13.633-.443-20.445-.763-31.264-1.474-56.284-26.359-57.892-57.624-2.195-42.95-.619-85.9 4.74-128.85z" opacity="1" data-original="#ffb983"></path><path fill="#e7ab8a" d="M348.304 302.072c-12.413 0-23.874-7.247-29.197-18.464a7.726 7.726 0 1 1 13.96-6.626c2.779 5.855 8.76 9.637 15.237 9.637s12.458-3.783 15.236-9.637a7.728 7.728 0 0 1 13.961 6.625c-5.323 11.217-16.784 18.465-29.197 18.465z" opacity="1" data-original="#e7ab8a"></path><path fill="#fcb143" d="M456.292 210.108s-78.687-3.658-107.983-52.224c-12.438 20.64-33.799 33.16-54.254 40.734-27.699 10.284-53.729 11.49-53.729 11.49S203.137 89.182 348.31 89.182s107.982 120.926 107.982 120.926z" opacity="1" data-original="#fcb143"></path><path fill="#fa9801" d="M348.31 89.182c-38.117 16.797-52.461 73.761-54.254 109.436-27.699 10.284-53.729 11.49-53.729 11.49S203.137 89.182 348.31 89.182z" opacity="1" data-original="#fa9801"></path><ellipse cx="278.559" cy="274.495" fill="#ec6161" rx="19.639" ry="9.064" opacity="1" data-original="#ec6161" class=""></ellipse><ellipse cx="418.049" cy="274.495" fill="#ec6161" rx="19.639" ry="9.064" opacity="1" data-original="#ec6161" class=""></ellipse><path fill="#ec6161" d="M247.038 139.387C162.477 95.582 151.147 21.632 189.829 3.892c38.259-17.543 57.209 34.637 57.209 34.637s18.945-52.18 57.204-34.637a35.648 35.648 0 0 1 5.754 3.304c.005.005.016.01.026.016.261.182.511.37.761.552 30.483 22.817 15.63 90.502-63.745 131.623z" opacity="1" data-original="#ec6161" class=""></path><path fill="#ffb983" d="M330.47 450.368h.12c10.295 0 18.637-8.349 18.637-18.637 0-10.295-8.342-18.644-18.637-18.644-.134 0-.268 0-.402.007H138.923c-.134-.007-.268-.007-.402-.007-10.295 0-18.637 8.349-18.637 18.644 0 10.288 8.342 18.637 18.637 18.637h.12" opacity="1" data-original="#ffb983"></path><path fill="#fcd0a3" d="M315.881 364.418a840.865 840.865 0 0 0-162.651 0c-4.207 33.71-5.446 67.42-3.718 101.13 1.259 24.539 20.895 44.072 45.439 45.23a839.001 839.001 0 0 0 79.208 0c24.544-1.159 44.18-20.691 45.439-45.23 1.73-33.71.49-67.42-3.717-101.13z" opacity="1" data-original="#fcd0a3"></path><path fill="#ffb983" d="M153.233 364.413a841.946 841.946 0 0 1 81.328-3.939c-13.726 0-27.452 1.326-41.177 3.979a1156.353 1156.353 0 0 0-1.885 102.098c.574 22.396 8.76 40.66 19.501 44.825a819.209 819.209 0 0 1-16.047-.599c-24.54-1.157-44.178-20.69-45.44-45.23-1.723-33.711-.486-67.422 3.72-101.134z" opacity="1" data-original="#ffb983"></path><path fill="#e7ab8a" d="M234.555 473.765c-9.788 0-18.825-5.715-23.023-14.559a6.181 6.181 0 0 1 11.168-5.3c2.162 4.555 6.815 7.498 11.855 7.498s9.693-2.943 11.855-7.498a6.18 6.18 0 1 1 11.168 5.3c-4.198 8.845-13.234 14.559-23.023 14.559z" opacity="1" data-original="#e7ab8a"></path><g fill="#394949"><ellipse cx="82.883" cy="240.324" rx="9.916" ry="14.745" fill="#394949" opacity="1" data-original="#394949"></ellipse><path d="M193.918 240.324c0-8.131-4.448-14.745-9.916-14.745s-9.917 6.615-9.917 14.745 4.449 14.745 9.917 14.745 9.916-6.614 9.916-14.745z" fill="#394949" opacity="1" data-original="#394949"></path><ellipse cx="297.745" cy="240.327" rx="9.916" ry="14.745" fill="#394949" opacity="1" data-original="#394949"></ellipse><path d="M398.863 225.581c-5.468 0-9.917 6.615-9.917 14.745s4.449 14.745 9.917 14.745 9.916-6.615 9.916-14.745-4.448-14.745-9.916-14.745z" fill="#394949" opacity="1" data-original="#394949"></path><ellipse cx="194.871" cy="425.184" rx="7.839" ry="11.629" fill="#394949" opacity="1" data-original="#394949"></ellipse><path d="M274.24 413.555c-4.322 0-7.839 5.217-7.839 11.629s3.517 11.629 7.839 11.629 7.839-5.217 7.839-11.629-3.517-11.629-7.839-11.629z" fill="#394949" opacity="1" data-original="#394949"></path></g><path fill="#d5694c" d="M319.317 401.465s-61.762-2.871-84.757-40.991c-9.763 16.201-26.529 26.028-42.585 31.973-21.741 8.072-42.172 9.018-42.172 9.018s-29.191-94.916 84.757-94.916 84.757 94.916 84.757 94.916z" opacity="1" data-original="#d5694c"></path><path fill="#a64c31" d="M234.56 306.549c-29.918 13.184-41.177 57.896-42.585 85.897-21.741 8.072-42.172 9.018-42.172 9.018s-29.191-94.915 84.757-94.915z" opacity="1" data-original="#a64c31"></path></g></svg></div>
                  <div class="option-text">
                    <h3>Родитель с детьми</h3>
                    <p>Дети до 17 лет</p>
                  </div>
                </div>
              </label>

              <label class="option-card" :class="{ 'selected': formData.recipientType === 'both' }">
                <input type="radio" v-model="formData.recipientType" value="both" />
                <div class="option-content">
                  <div class="option-icon"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g transform="matrix(1.0699999999999998,0,0,1.0699999999999998,-17.91999999999996,-17.92000026702874)"><path fill="#23aae6" d="M384 464.074h-64v-112c0-17.673 14.327-32 32-32h32z" opacity="1" data-original="#23aae6"></path><path fill="#f0915a" d="M392 496.074h-64a8 8 0 0 1-8-8v-24h64c8.837 0 16 7.163 16 16v8a8 8 0 0 1-8 8z" opacity="1" data-original="#f0915a"></path><path fill="#23aae6" d="M256 320.074c-44.183 0-80 35.817-80 80v32h-32v48c0 8.837 7.163 16 16 16h48c35.346 0 64-28.654 64-64v-112z" opacity="1" data-original="#23aae6"></path><path fill="#fab991" d="M72 493.407h8c8.837 0 16-7.163 16-16v-53.333H72a8 8 0 0 0-8 8v53.333a8 8 0 0 0 8 8z" opacity="1" data-original="#fab991" class=""></path><path fill="#5ad7ff" d="M208 320.074c-44.183 0-80 35.817-80 80v24H96v56c0 8.837 7.163 16 16 16h48c35.346 0 64-28.654 64-64h48v32h64v-38.676c28.25-12.347 48-40.522 48-73.324v-32z" opacity="1" data-original="#5ad7ff"></path><path fill="#fab991" d="M344 496.074h-64a8 8 0 0 1-8-8v-24h64c8.837 0 16 7.163 16 16v8a8 8 0 0 1-8 8z" opacity="1" data-original="#fab991" class=""></path><circle cx="352" cy="320.074" r="32" fill="#ffd205" opacity="1" data-original="#ffd205"></circle><path fill="#fab991" d="M320 64.074c-70.693 0-128 57.308-128 128 0 70.692 57.307 128 128 128h48c44.183 0 80-35.817 80-80v-48c0-70.692-57.307-128-128-128z" opacity="1" data-original="#fab991" class=""></path><path fill="#f0915a" d="M288 192.074v80c-22.091 0-40-17.909-40-40s17.909-40 40-40z" opacity="1" data-original="#f0915a"></path><circle cx="348" cy="204.074" r="12" fill="#463c4b" opacity="1" data-original="#463c4b"></circle><circle cx="412" cy="204.074" r="12" fill="#463c4b" opacity="1" data-original="#463c4b"></circle><path fill="#f0915a" d="M389.333 264.074c-5.891 0-10.667-4.776-10.667-10.667v-29.333c11.782 0 21.333 9.551 21.333 21.333v8c.001 5.891-4.775 10.667-10.666 10.667zM344 248.074h-16a8 8 0 0 1 0-16h16a8 8 0 0 1 0 16zM432 240.074a8 8 0 0 0 8 8h7.601c.261-2.631.399-5.298.399-7.998v-8.002h-8a8 8 0 0 0-8 8z" opacity="1" data-original="#f0915a"></path><path fill="#463c4b" d="M361.185 110.741H352a4 4 0 0 1 0-8h9.185c28.02 0 50.815-22.795 50.815-50.815 0-15.439-12.561-28-28-28-11.028 0-20 8.972-20 20 0 6.617 5.383 12 12 12a4 4 0 0 1 0 8c-11.028 0-20-8.972-20-20 0-15.439 12.561-28 28-28 19.851 0 36 16.149 36 36 0 32.431-26.384 58.815-58.815 58.815z" opacity="1" data-original="#463c4b"></path></g></svg></div>
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
    flex-shrink: 0;
    display: flex;
    align-items: center;
    svg{
      width: 40px;
      height: 40px;
    }
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
  padding-left: 25px;
  position: relative;
  
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