<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
// ИЗМЕНЕНО: Добавляем useRoute для доступа к параметрам URL
import { useRoute } from 'vue-router'
import { regions, findRegionByCode } from '../data/regions'
import SmartResults from './SmartResults.vue'
// УДАЛЕНО: Больше не используем определение по IP
// import { detectRegionByIP } from '../utils/geoDetection'
import { trackEvent, YM_EVENTS, getStepName, StepTimer } from '../utils/yandexMetrika'
import IconOne from './svg-elements/one.vue'
import IconTwo from './svg-elements/two.vue'
import IconThree from './svg-elements/three.vue'

// ИЗМЕНЕНО: Получаем доступ к текущему роуту
const route = useRoute()

// Таймер для отслеживания бездействия пользователя
const inactivityTimer = ref(null);
// Флаг для запуска анимации
const startPulsing = ref(false);

// Инициализация таймера для отслеживания времени на шагах
const stepTimer = new StepTimer()
const isCalculatorStarted = ref(false)

// Ключ для localStorage
const STORAGE_KEY = 'calculatorProgress'

// Рефы для элементов
const contentContainer = ref(null)
const calculatorRef = ref(null)
const isCalculatorInView = ref(false)
const isMobile = ref(false)


// Переменные для отслеживания скролла
let scrollTimeout = null
let lastScrollY = 0
let isScrollingDown = false
let touchStartY = 0
// Функции для работы с localStorage
const saveToLocalStorage = () => {
  try {
    const dataToSave = {
      currentQuestionIndex: currentQuestionIndex.value,
      showResults: showResults.value,
      formData: formData.value,
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    
    // Отслеживаем сохранение прогресса
    trackEvent(YM_EVENTS.PROGRESS_SAVED, {
      step: getStepName(currentQuestionIndex.value, questions),
      step_number: currentQuestionIndex.value + 1
    })
  } catch (error) {
    console.error('Ошибка сохранения в localStorage:', error)
    trackEvent(YM_EVENTS.CALCULATOR_ERROR, {
      error_type: 'localStorage_save',
      error_message: error.message
    })
  }
}

const loadFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      const parsed = JSON.parse(savedData)
      
      // Проверяем, что данные не старше 24 часов
      const dayInMs = 24 * 60 * 60 * 1000
      if (Date.now() - parsed.timestamp < dayInMs) {
        return parsed
      } else {
        // Если данные старые, удаляем их
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки из localStorage:', error)
    localStorage.removeItem(STORAGE_KEY)
    trackEvent(YM_EVENTS.CALCULATOR_ERROR, {
      error_type: 'localStorage_load',
      error_message: error.message
    })
  }
  return null
}

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Ошибка очистки localStorage:', error)
  }
}

// Функция для плавного скролла к калькулятору
const scrollToCalculator = () => {
  if (calculatorRef.value) {
    const element = calculatorRef.value;
    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
    
    window.scrollTo({
      top: offsetTop - 20,
      behavior: 'smooth'
    });
  }
}

const scrollToTop = () => {
  if (calculatorRef.value) {
    const element = calculatorRef.value;
    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
    
    window.scrollTo({
      top: offsetTop - 70,
      behavior: 'smooth'
    });
  }
}

// Обработчики скролла
const handleScroll = () => {
  // На ПК всегда показываем контролы
  isCalculatorInView.value = true
}

const checkCalculatorVisibility = () => {
  // Всегда показываем контролы
  isCalculatorInView.value = true
}

// Обработчик ресайза
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  // Убираем вызов checkCalculatorVisibility
}

// Получение текущей даты для расчета периода
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth() + 1

// Месяцы для выбора
const months = [
  { value: 1, label: 'Январь' },
  { value: 2, label: 'Февраль' },
  { value: 3, label: 'Март' },
  { value: 4, label: 'Апрель' },
  { value: 5, label: 'Май' },
  { value: 6, label: 'Июнь' },
  { value: 7, label: 'Июль' },
  { value: 8, label: 'Август' },
  { value: 9, label: 'Сентябрь' },
  { value: 10, label: 'Октябрь' },
  { value: 11, label: 'Ноябрь' },
  { value: 12, label: 'Декабрь' }
]

// Основные данные формы - инициализируем значениями по умолчанию
const getDefaultFormData = () => ({
  region: '',
  
  // Период подачи заявления
  applicationDate: {
    month: currentMonth,
    year: currentYear
  },
  
  recipientType: '', // pregnant, parent, both
  
  // Детальная информация о беременности
  pregnancy: {
    weeksSinceRegistration: 6,
    registrationWeek: 12,
    currentWeek: 20
  },
  
  childrenCount: 1,
  studentChildrenCount: 0,
  hasSpouse: false,
  totalIncome: 0,
  
  // Детализированные доходы
  detailedIncome: {
    salary: 0,
    business: 0,
    rental: 0,
    alimony: 0,
    benefits: 0,
    pension: 0,
    scholarship: 0,
    securities: 0,
    interest: 0,
    lottery: 0,
    inheritance: 0,
    gifts: 0,
    other: 0
  },
  
  // Расширенная проверка транспорта
  transport: {
    carsCount: 0,
    carsYoungerThan5Years: 0,
    hasLuxuryCar: false,
    motorcyclesCount: 0,
    hasBoat: false,
    hasSelfPropelled: false,
    hasTractor: false,
    transportFromSocial: false
  },
  
  // Расширенная проверка имущества
  propertyCheck: {
    apartmentsCount: 1,
    totalApartmentArea: 0,
    housesCount: 0,
    totalHouseArea: 0,
    hasCountryHouse: false,
    garagesCount: 0,
    landAreaCity: 0,
    landAreaRural: 0,
    hasNonResidential: false,
    hasCommercialProperty: false
  },
  
  // Исключения по имуществу
  propertyExceptions: {
    hasUninhabitableHousing: false,
    hasArrestedProperty: false,
    hasGuardianshipProperty: false,
    hasFarEastHectare: false,
    hasMultifamilySupport: false,
    hasDisabledHousing: false
  },
  
  // Детализированная проверка нулевого дохода
  adultsIncome: {
    applicantHasIncome: false,
    spouseHasIncome: false,
    applicantReasons: [],
    spouseReasons: []
  },
  
  // Уважительные причины отсутствия дохода
  validReasons: {
    childCareUnder3: false,
    childCareForSingle: false,
    childCareInLargeFamily: false,
    disabledCare: false,
    elderCare: false,
    fullTimeStudy: false,
    militaryService: false,
    imprisonment: false,
    unemployment: false,
    longTermTreatment: false
  },
  
  // Самозанятые
  selfEmployed: {
    isSelfEmployed: false,
    yearlyIncome: 0,
    monthsActive: 12
  },
  
  // Алименты
  alimony: {
    receivesAlimony: false,
    monthlyAmount: 0,
    childrenCount: 0,
    hasCourtDecision: false,
    isVoluntaryAgreement: false
  },
  
  special: {
    singleParent: false,
    hasDisabled: false,
    mobilized: false,
    refugeeStatus: false,
    emergencySituation: false
  }
})

// Основные данные формы
const formData = ref(getDefaultFormData())

// Состояние калькулятора
const currentQuestionIndex = ref(0)
const showResults = ref(false)
// УДАЛЕНО: Больше не нужно
// const isDetectingRegion = ref(false)
const isAutoDetected = ref(false) // Этот флаг оставляем, он полезен для UI
const showIncomeHelp = ref(false)
const showReasonDetails = ref(false)

// ТЕПЕРЬ ДОБАВЛЯЕМ код для выбора региона после formData
// Данные для выбора региона
const regionSearch = ref('')
const showRegionDropdown = ref(false)
const regionSearchInput = ref(null)

// Отсортированный по алфавиту список регионов
const sortedRegions = computed(() => {
  return [...regions].sort((a, b) => a.name.localeCompare(b.name))
})

// Отфильтрованные регионы по поиску
const filteredRegions = computed(() => {
  if (!regionSearch.value.trim()) {
    return sortedRegions.value
  }
  
  const searchTerm = regionSearch.value.toLowerCase().trim()
  return sortedRegions.value.filter(region => 
    region.name.toLowerCase().includes(searchTerm)
  )
})

// Название выбранного региона
const selectedRegionName = computed(() => {
  if (!formData.value.region) return ''
  const region = findRegionByCode(formData.value.region)
  return region ? region.name : ''
})

// Методы для работы с регионами
const selectRegion = (region) => {
  formData.value.region = region.code
  regionSearch.value = region.name // Показываем полное название в поле ввода
  showRegionDropdown.value = false
}

const handleRegionSearch = () => {
  // При вводе текста автоматически открываем dropdown
  if (!showRegionDropdown.value) {
    showRegionDropdown.value = true
  }
}

const toggleDropdown = () => {
  showRegionDropdown.value = !showRegionDropdown.value
  if (showRegionDropdown.value) {
    nextTick(() => {
      regionSearchInput.value?.focus()
    })
  }
}

const closeRegionDropdown = () => {
  // Не закрываем dropdown если фокус в поле ввода
  if (document.activeElement === regionSearchInput.value) {
    return
  }
  showRegionDropdown.value = false
  
  // Если есть выбранный регион, показываем его название в поле поиска
  if (formData.value.region && regionSearch.value !== selectedRegionName.value) {
    regionSearch.value = selectedRegionName.value
  }
}

// Директива для закрытия по клику вне элемента
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// При монтировании устанавливаем начальное значение если регион уже выбран
watch(() => formData.value.region, (newRegion) => {
  if (newRegion && !regionSearch.value) {
    const region = findRegionByCode(newRegion)
    if (region) {
      regionSearch.value = region.name
    }
  }
}, { immediate: true })

// Список вопросов
const questions = ['region', 'recipient', 'family', 'income', 'transport', 'property', 'conditions']

// Вычисляемые свойства
const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const currentQuestionNumber = computed(() => currentQuestionIndex.value + 1)
const totalQuestions = computed(() => questions.length)
const isFirstQuestion = computed(() => currentQuestionIndex.value === 0)
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.length - 1)

// Данные региона
const currentRegion = computed(() => findRegionByCode(formData.value.region))
const currentRegionPM = computed(() => currentRegion.value?.pmValue || 0)

// Расчет периода для доходов
const calculationPeriod = computed(() => {
  const appMonth = formData.value.applicationDate.month
  const appYear = formData.value.applicationDate.year
  
  let startMonth = appMonth - 1
  let startYear = appYear
  
  if (startMonth <= 0) {
    startMonth = 12 + startMonth
    startYear--
  }
  
  let periodStartMonth = startMonth
  let periodStartYear = startYear - 1
  
  let periodEndMonth = startMonth - 1
  let periodEndYear = startYear
  
  if (periodEndMonth <= 0) {
    periodEndMonth = 12
    periodEndYear--
  }
  
  return {
    startMonth: periodStartMonth,
    startYear: periodStartYear,
    endMonth: periodEndMonth,
    endYear: periodEndYear,
    displayStart: `${months[periodStartMonth - 1].label} ${periodStartYear}`,
    displayEnd: `${months[periodEndMonth - 1].label} ${periodEndYear}`
  }
})

// Расчет состава семьи
const totalFamilyMembers = computed(() => {
  let total = 1 // Заявитель
  if (formData.value.hasSpouse) total += 1
  
  total += formData.value.childrenCount
  total += formData.value.studentChildrenCount

  return Math.max(1, total)
})

// Расчет общего количества детей
const totalChildren = computed(() => {
  return formData.value.childrenCount + formData.value.studentChildrenCount
})

// Проверка - многодетная семья
const isLargeFamily = computed(() => {
  return totalChildren.value >= 3
})

// Проверка - беременная женщина
const isPregnantRecipient = computed(() => {
  return formData.value.recipientType === 'pregnant' || formData.value.recipientType === 'both'
})

// Расчет общего дохода из детализированных источников
const calculatedTotalIncome = computed(() => {
  const detailed = formData.value.detailedIncome
  return Object.values(detailed).reduce((sum, val) => sum + (val || 0), 0)
})

// Расчет среднедушевого дохода
const averageMonthlyIncome = computed(() => {
  if (totalFamilyMembers.value === 0) return 0
  const totalIncome = formData.value.totalIncome || calculatedTotalIncome.value
  return Math.round(totalIncome / 12 / totalFamilyMembers.value)
})

// Проверка освобождения от правила нулевого дохода
const isExemptFromZeroIncomeRule = computed(() => {
  return formData.value.special.mobilized ||
         formData.value.special.singleParent ||
         isPregnantRecipient.value ||
         isLargeFamily.value
})

// Проверка нужна ли проверка нулевого дохода
const needsZeroIncomeCheck = computed(() => {
  if (isExemptFromZeroIncomeRule.value) return false
  return averageMonthlyIncome.value < currentRegionPM.value * 0.3
})

// Детализированная проверка нулевого дохода
const needsDetailedZeroIncomeCheck = computed(() => {
  return needsZeroIncomeCheck.value && !isExemptFromZeroIncomeRule.value
})

// Подсчет месяцев с уважительными причинами
const calculateValidReasonMonths = (reasons) => {
  if (!reasons || reasons.length === 0) return 0
  const uniqueMonths = new Set(reasons.map(r => r.month))
  return uniqueMonths.size
}

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
      return formData.value.recipientType === 'pregnant' || 
             formData.value.childrenCount > 0 || 
             formData.value.studentChildrenCount > 0
    case 'income':
      return true
    case 'transport':
      return true
    case 'property':
      return true
    case 'conditions':
      return true
    default:
      return true
  }
})

// Навигация с метрикой
const nextQuestion = () => {
  // Отслеживаем завершение текущего шага

  clearTimeout(inactivityTimer.value);
  startPulsing.value = false;

  const currentStepName = getStepName(currentQuestionIndex.value, questions)
  trackEvent(YM_EVENTS.STEP_COMPLETE, {
    step: currentStepName,
    step_number: currentQuestionIndex.value + 1,
    total_steps: questions.length
  })
  
  // Отслеживаем специфические события для каждого шага
  switch (currentQuestion.value) {
    case 'region':
      trackEvent(YM_EVENTS.REGION_SELECTED, {
        region: formData.value.region,
        region_name: currentRegion.value?.name,
        auto_detected: isAutoDetected.value
      })
      break
    case 'recipient':
      trackEvent(YM_EVENTS.RECIPIENT_SELECTED, {
        type: formData.value.recipientType,
        is_pregnant: isPregnantRecipient.value
      })
      break
    case 'family':
      trackEvent(YM_EVENTS.FAMILY_CONFIGURED, {
        family_size: totalFamilyMembers.value,
        children_count: totalChildren.value,
        has_spouse: formData.value.hasSpouse,
        is_single_parent: formData.value.special.singleParent,
        is_large_family: isLargeFamily.value
      })
      break
    case 'income':
      trackEvent(YM_EVENTS.INCOME_ENTERED, {
        income_percent: Math.round((averageMonthlyIncome.value / currentRegionPM.value) * 100),
        passes_income_test: averageMonthlyIncome.value <= currentRegionPM.value,
        average_income: averageMonthlyIncome.value,
        total_yearly_income: formData.value.totalIncome || calculatedTotalIncome.value
      })
      break
    case 'transport':
      trackEvent(YM_EVENTS.TRANSPORT_CONFIGURED, {
        cars: formData.value.transport.carsCount,
        motorcycles: formData.value.transport.motorcyclesCount,
        has_luxury: formData.value.transport.hasLuxuryCar,
        has_boat: formData.value.transport.hasBoat,
        from_social: formData.value.transport.transportFromSocial
      })
      break
    case 'property':
      trackEvent(YM_EVENTS.PROPERTY_CONFIGURED, {
        apartments: formData.value.propertyCheck.apartmentsCount,
        houses: formData.value.propertyCheck.housesCount,
        garages: formData.value.propertyCheck.garagesCount,
        has_country_house: formData.value.propertyCheck.hasCountryHouse,
        has_commercial: formData.value.propertyCheck.hasCommercialProperty
      })
      break
    case 'conditions':
      trackEvent(YM_EVENTS.CONDITIONS_CONFIGURED, {
        needs_zero_income_check: needsZeroIncomeCheck.value,
        is_self_employed: formData.value.selfEmployed.isSelfEmployed,
        receives_alimony: formData.value.alimony.receivesAlimony,
        has_special_circumstances: hasSpecialCircumstances.value
      })
      break
  }

  if (isLastQuestion.value) {
    showResults.value = true
    stepTimer.endTimer()
    
    // Получаем результат расчета
    const result = getCalculationData()
    
    // Отслеживаем завершение калькулятора
    trackEvent(YM_EVENTS.CALCULATION_COMPLETE, {
      is_eligible: result.isEligible,
      benefit_amount: result.benefitAmount,
      denial_reasons_count: result.denialReasons?.length || 0,
      completion_time: Math.round((Date.now() - calculatorStartTime) / 1000)
    })
    
    // Отслеживаем результат
    if (result.isEligible) {
      trackEvent(YM_EVENTS.RESULT_ELIGIBLE, {
        benefit_amount: result.benefitAmount,
        benefit_percent: result.benefitDetails?.[0]?.percent || 0,
        region: formData.value.region,
        family_size: totalFamilyMembers.value,
        children_count: totalChildren.value
      })
    } else {
      trackEvent(YM_EVENTS.RESULT_NOT_ELIGIBLE, {
        main_reason: result.denialReasons?.[0] || 'unknown',
        reasons_count: result.denialReasons?.length || 0,
        failed_income_test: averageMonthlyIncome.value > currentRegionPM.value,
        failed_property_test: hasPropertyIssues.value,
        failed_zero_income: needsDetailedZeroIncomeCheck.value
      })
    }
  } else {
    currentQuestionIndex.value++
    // Отслеживаем просмотр нового шага
    const newStepName = getStepName(currentQuestionIndex.value, questions)
    trackEvent(YM_EVENTS.STEP_VIEW, {
      step: newStepName,
      step_number: currentQuestionIndex.value + 1,
      total_steps: questions.length
    })
    stepTimer.startStep(newStepName)
  }
  
  nextTick(() => {
    scrollToTop()
    saveToLocalStorage()
  })
}

const previousQuestion = () => {

  // Останавливаем таймер и анимацию при клике
  clearTimeout(inactivityTimer.value);
  startPulsing.value = false;
  
  if (!isFirstQuestion.value) {
    // Отслеживаем возврат назад
    const fromStep = getStepName(currentQuestionIndex.value, questions)
    const toStep = getStepName(currentQuestionIndex.value - 1, questions)
    
    trackEvent(YM_EVENTS.STEP_BACK, {
      from_step: fromStep,
      to_step: toStep,
      from_step_number: currentQuestionIndex.value + 1,
      to_step_number: currentQuestionIndex.value
    })
    
    currentQuestionIndex.value--
    stepTimer.startStep(toStep)
    
    nextTick(() => {
      scrollToTop()
      saveToLocalStorage()
    })
  }
}

const resetCalculator = () => {
  trackEvent(YM_EVENTS.RESULT_RECALCULATE, {
    from_result: showResults.value,
    last_step: getStepName(currentQuestionIndex.value, questions),
    was_eligible: getCalculationData()?.isEligible
  })
  
  currentQuestionIndex.value = 0
  showResults.value = false
  formData.value = getDefaultFormData()
  
  // ДОБАВЛЕНО: Сбрасываем состояние поиска региона
  regionSearch.value = ''
  isAutoDetected.value = false
  showRegionDropdown.value = false
  
  clearLocalStorage()
  isCalculatorStarted.value = false
  calculatorStartTime = Date.now()
  
  nextTick(() => {
    scrollToTop()
    // Начинаем новую сессию калькулятора
    trackEvent(YM_EVENTS.CALCULATOR_START, {
      is_recalculation: true
    })
    isCalculatorStarted.value = true
    stepTimer.startStep(getStepName(0, questions))
  })
}

// Управление счетчиками
const incrementChildren = () => {
  if (formData.value.childrenCount < 10) formData.value.childrenCount++
}

const decrementChildren = () => {
  if (formData.value.childrenCount > 0) formData.value.childrenCount--
}

// Склонения
const getFamilyWord = (count) => {
  if (count === 1) return 'человек'
  if (count >= 2 && count <= 4) return 'человека'
  return 'человек'
}

// Форматирование
const formatAmount = (amount) => {
  return new Intl.NumberFormat('ru-RU').format(Math.round(amount))
}

// Дополнительные проверки для расчета
const hasPropertyIssues = computed(() => {
  const check = formData.value.propertyCheck
  return check.apartmentsCount > 1 || check.housesCount > 1 || 
         check.hasCommercialProperty || check.hasNonResidential
})

const hasSpecialCircumstances = computed(() => {
  const special = formData.value.special
  return special.singleParent || special.hasDisabled || 
         special.mobilized || special.refugeeStatus || special.emergencySituation
})

// Время начала заполнения калькулятора
let calculatorStartTime = Date.now()

// Подготовка данных для расчета
const getCalculationData = () => {
  const region = currentRegion.value
  if (!region) return null

  let isEligible = true
  let denialReasons = []
  
  // Проверка 1: Есть ли дети для родителя
  if (formData.value.recipientType === 'parent' && totalChildren.value === 0) {
    isEligible = false
    denialReasons.push('Для получения пособия родителем необходимо иметь детей до 17 лет (до дня 17-летия) или студентов-очников до 23 лет.')
  }

  // Проверка 2: Для беременных - срок и постановка на учет
  if (isPregnantRecipient.value) {
    if (formData.value.pregnancy.currentWeek < 6) {
      isEligible = false
      denialReasons.push('Пособие беременным назначается с 6 недели беременности.')
    }
    if (formData.value.pregnancy.registrationWeek > 12) {
      isEligible = false
      denialReasons.push('Необходимо встать на учет в медицинской организации до 12 недель беременности.')
    }
  }

  // Проверка 3: Доход не превышает прожиточный минимум
  if (averageMonthlyIncome.value > currentRegionPM.value) {
    isEligible = false
    denialReasons.push(`Среднедушевой доход (${formatAmount(averageMonthlyIncome.value)} ₽) превышает прожиточный минимум региона (${formatAmount(currentRegionPM.value)} ₽).`)
  }

  // Проверка 4: Правило нулевого дохода
  if (needsDetailedZeroIncomeCheck.value) {
    let zeroIncomeIssues = []
    
    if (!formData.value.adultsIncome.applicantHasIncome) {
      const validMonths = calculateValidReasonMonths(formData.value.adultsIncome.applicantReasons)
      if (validMonths < 10) {
        zeroIncomeIssues.push(`заявитель (${validMonths} месяцев из 10 требуемых)`)
      }
    }
    
    if (formData.value.hasSpouse && !formData.value.adultsIncome.spouseHasIncome) {
      const validMonths = calculateValidReasonMonths(formData.value.adultsIncome.spouseReasons)
      if (validMonths < 10) {
        zeroIncomeIssues.push(`супруг(а) (${validMonths} месяцев из 10 требуемых)`)
      }
    }
    
    if (zeroIncomeIssues.length > 0) {
      isEligible = false
      denialReasons.push(`Нарушено правило нулевого дохода для: ${zeroIncomeIssues.join(', ')}. Уважительные причины должны покрывать минимум 10 месяцев из 12.`)
    }
  }

  // Проверка 5: Транспорт
  if (!formData.value.transport.transportFromSocial) {
    const maxCars = (isLargeFamily.value || formData.value.special.hasDisabled) ? 2 : 1
    const maxMotorcycles = (isLargeFamily.value || formData.value.special.hasDisabled) ? 2 : 1
  if (formData.value.transport.carsCount > maxCars) {
      isEligible = false
      denialReasons.push(`Количество автомобилей (${formData.value.transport.carsCount}) превышает допустимое (${maxCars}).`)
    }
    
    if (formData.value.transport.motorcyclesCount > maxMotorcycles) {
      isEligible = false
      denialReasons.push(`Количество мотоциклов (${formData.value.transport.motorcyclesCount}) превышает допустимое (${maxMotorcycles}).`)
    }
    
    if (formData.value.transport.hasLuxuryCar && totalChildren.value < 4) {
      isEligible = false
      denialReasons.push('Наличие автомобиля премиум-класса (мощнее 250 л.с., младше 5 лет). Исключение: семьи с 4 и более детьми.')
    }
    
    if (formData.value.transport.hasBoat) {
      isEligible = false
      denialReasons.push('Наличие катера или моторной лодки с двигателем мощнее 5 л.с.')
    }
    
    if (formData.value.transport.hasSelfPropelled) {
      isEligible = false
      denialReasons.push('Наличие самоходной техники младше 5 лет.')
    }
    
    if (formData.value.transport.hasTractor) {
      isEligible = false
      denialReasons.push('Наличие трактора или комбайна младше 5 лет.')
    }
  }

  // Проверка 6: Имущество
  if (!formData.value.propertyExceptions.hasArrestedProperty && 
      !formData.value.propertyExceptions.hasGuardianshipProperty &&
      !formData.value.propertyExceptions.hasMultifamilySupport) {
    
    if (!formData.value.propertyExceptions.hasUninhabitableHousing) {
      if (formData.value.propertyCheck.apartmentsCount > 1) {
        const areaPerPerson = formData.value.propertyCheck.totalApartmentArea / totalFamilyMembers.value
        if (areaPerPerson > 24) {
          isEligible = false
          denialReasons.push(`При наличии нескольких квартир площадь на человека (${formatAmount(areaPerPerson)} кв.м.) превышает норму в 24 кв.м.`)
        }
      }
    }

    if (!formData.value.propertyExceptions.hasUninhabitableHousing) {
      if (formData.value.propertyCheck.housesCount > 1) {
        const areaPerPerson = formData.value.propertyCheck.totalHouseArea / totalFamilyMembers.value
        if (areaPerPerson > 40) {
          isEligible = false
          denialReasons.push(`При наличии нескольких домов площадь на человека (${formatAmount(areaPerPerson)} кв.м.) превышает норму в 40 кв.м.`)
        }
      }
    }

    if (formData.value.propertyCheck.hasCountryHouse && formData.value.propertyCheck.housesCount > 0) {
      isEligible = false
      denialReasons.push('Семья имеет и жилой дом, и дачу одновременно. Разрешено только одно.')
    }

    const maxGarages = (isLargeFamily.value || formData.value.special.hasDisabled) ? 2 : 1
    if (formData.value.propertyCheck.garagesCount > maxGarages) {
      isEligible = false
      denialReasons.push(`Количество гаражей (${formData.value.propertyCheck.garagesCount}) превышает лимит (${maxGarages}).`)
    }

    if (!formData.value.propertyExceptions.hasFarEastHectare) {
      if (formData.value.propertyCheck.landAreaCity > 0.25) {
        isEligible = false
        denialReasons.push('Площадь земельных участков в городе превышает 0.25 га.')
      }
      if (formData.value.propertyCheck.landAreaRural > 1) {
        isEligible = false
        denialReasons.push('Площадь земельных участков в сельской местности превышает 1 га.')
      }
    }

    if (formData.value.propertyCheck.hasNonResidential) {
      isEligible = false
      denialReasons.push('Семья владеет нежилым помещением (кроме гаражей, хозпостроек на личных подсобных хозяйствах и общего имущества в многоквартирных домах).')
    }
    
    if (formData.value.propertyCheck.hasCommercialProperty) {
      isEligible = false
      denialReasons.push('Семья владеет коммерческой недвижимостью.')
    }
  }
  
  // Проверка 7: Проценты по вкладам
  if (formData.value.detailedIncome.interest > 17733) {
    isEligible = false
    denialReasons.push(`Годовой доход от процентов по вкладам (${formatAmount(formData.value.detailedIncome.interest)} ₽) превышает прожиточный минимум по РФ (17 733 ₽).`)
  }

  // Проверка 8: Самозанятые
  if (formData.value.selfEmployed?.isSelfEmployed) {
    const MROT = 22440
    const minSelfEmployedIncome = MROT * 2
    const requiredIncome = (formData.value.selfEmployed.monthsActive / 12) * minSelfEmployedIncome
    
    if (formData.value.selfEmployed.yearlyIncome < requiredIncome) {
      isEligible = false
      denialReasons.push(`Доход самозанятого (${formatAmount(formData.value.selfEmployed.yearlyIncome)} ₽) меньше минимального (${formatAmount(requiredIncome)} ₽ за ${formData.value.selfEmployed.monthsActive} месяцев работы).`)
    }
  }

  // Проверка 9: Алименты
  if (formData.value.alimony?.receivesAlimony && formData.value.alimony.monthlyAmount > 0) {
    const MROT = 22440
    let minAlimony = 0
    
    if (formData.value.alimony.childrenCount === 1) {
      minAlimony = MROT * 0.25
    } else if (formData.value.alimony.childrenCount === 2) {
      minAlimony = MROT * (1/3)
    } else if (formData.value.alimony.childrenCount >= 3) {
      minAlimony = MROT * 0.5
    }
    
    if (formData.value.alimony.monthlyAmount < minAlimony && !formData.value.alimony.isVoluntaryAgreement) {
      isEligible = false
      denialReasons.push(`Получаемые алименты (${formatAmount(formData.value.alimony.monthlyAmount)} ₽/мес) меньше минимальных (${formatAmount(minAlimony)} ₽/мес на ${formData.value.alimony.childrenCount} детей). Исключение: добровольное соглашение об уплате алиментов.`)
    }
  }

  // Расчет размера пособия
  let benefitAmount = 0
  let benefitDetails = []
  
  if (isEligible) {
    const childPM = region.pmChild
    const workingPM = region.pmWorking
    const familySize = totalFamilyMembers.value
    const totalYearlyIncome = formData.value.totalIncome || calculatedTotalIncome.value

    let finalBenefitPercent = 0

    // Расчет с 50% пособием
    let benefitPerChild_50 = childPM * 0.5
    let pregnantBenefit_50 = isPregnantRecipient.value ? workingPM * 0.5 : 0
    let totalMonthlyBenefit_50 = (benefitPerChild_50 * totalChildren.value) + pregnantBenefit_50
    let newAverageIncome_50 = (totalYearlyIncome + (totalMonthlyBenefit_50 * 12)) / 12 / familySize

    if (newAverageIncome_50 > currentRegionPM.value) {
      finalBenefitPercent = 50
    } else {
      // Расчет с 75% пособием
      let benefitPerChild_75 = childPM * 0.75
      let pregnantBenefit_75 = isPregnantRecipient.value ? workingPM * 0.75 : 0
      let totalMonthlyBenefit_75 = (benefitPerChild_75 * totalChildren.value) + pregnantBenefit_75
      let newAverageIncome_75 = (totalYearlyIncome + (totalMonthlyBenefit_75 * 12)) / 12 / familySize

      if (newAverageIncome_75 > currentRegionPM.value) {
        finalBenefitPercent = 75
      } else {
        finalBenefitPercent = 100
      }
    }

    // Начисление пособия на детей
    if (totalChildren.value > 0) {
      const benefitPerChild = Math.round(childPM * (finalBenefitPercent / 100))
      const totalChildBenefit = benefitPerChild * totalChildren.value
      benefitAmount += totalChildBenefit
      
      benefitDetails.push({
        type: 'children',
        count: totalChildren.value,
        amountPerChild: benefitPerChild,
        total: totalChildBenefit,
        percent: finalBenefitPercent
      })
    }
    
    // Начисление пособия беременной
    if (isPregnantRecipient.value) {
      const pregnantBenefit = Math.round(workingPM * (finalBenefitPercent / 100))
      benefitAmount += pregnantBenefit
      
      benefitDetails.push({
        type: 'pregnancy',
        amount: pregnantBenefit,
        percent: finalBenefitPercent,
        paymentPeriod: 'С месяца постановки на учет (но не ранее 6 недель беременности) до месяца родов включительно'
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
    calculationPeriod: calculationPeriod.value,
    calculations: {
      totalFamilyMembers: totalFamilyMembers.value,
      totalChildren: totalChildren.value,
      totalYearlyIncome: formData.value.totalIncome || calculatedTotalIncome.value,
      averageMonthlyIncome: averageMonthlyIncome.value,
      incomePercent: Math.round((averageMonthlyIncome.value / currentRegionPM.value) * 100),
      isLargeFamily: isLargeFamily.value,
      isExemptFromZeroIncome: isExemptFromZeroIncomeRule.value
    }
  }
}

// Добавление/удаление причин отсутствия дохода
const addValidReason = (person, month, reason) => {
  const reasons = person === 'applicant' 
    ? formData.value.adultsIncome.applicantReasons 
    : formData.value.adultsIncome.spouseReasons
  
  const existingIndex = reasons.findIndex(r => r.month === month)
  if (existingIndex >= 0) {
    reasons[existingIndex] = { month, reason }
  } else {
    reasons.push({ month, reason })
  }
}

const removeValidReason = (person, month) => {
  const reasons = person === 'applicant' 
    ? formData.value.adultsIncome.applicantReasons 
    : formData.value.adultsIncome.spouseReasons
  
  const index = reasons.findIndex(r => r.month === month)
  if (index >= 0) {
    reasons.splice(index, 1)
  }
}

// Список уважительных причин для выбора
const validReasonsList = [
  { value: 'childCare', label: 'Уход за ребенком до 3 лет' },
  { value: 'disabledCare', label: 'Уход за инвалидом' },
  { value: 'elderCare', label: 'Уход за пожилым старше 80 лет' },
  { value: 'study', label: 'Очное обучение' },
  { value: 'military', label: 'Военная служба' },
  { value: 'unemployment', label: 'Официальная безработица (до 6 мес)' },
  { value: 'treatment', label: 'Длительное лечение (более 3 мес)' },
  { value: 'imprisonment', label: 'Лишение свободы' }
]

// Отслеживание изменений для автосохранения
watch([currentQuestionIndex, showResults, formData], () => {
  saveToLocalStorage()
}, { deep: true })

watch(canProceed, (isNowProceedable, wasPreviouslyProceedable) => {
  // Всегда сбрасываем предыдущее состояние при изменении
  clearTimeout(inactivityTimer.value);
  startPulsing.value = false;

  // Если кнопка только что стала активной (была неактивна, а стала активна)
  if (isNowProceedable && !wasPreviouslyProceedable) {
    // Запускаем таймер на 3 секунды
    inactivityTimer.value = setTimeout(() => {
      // Если таймер сработал (пользователь бездействовал), запускаем пульсацию
      startPulsing.value = true;
    }, 3000); // 3 секунды бездействия
  }
});

watch(() => formData.value.region, (newRegion, oldRegion) => {
  if (newRegion && !regionSearch.value) {
    const region = findRegionByCode(newRegion)
    if (region) {
      regionSearch.value = region.name
    }
  }
  
  // При сбросе региона также сбрасываем поиск
  if (!newRegion && oldRegion) {
    regionSearch.value = ''
  }
}, { immediate: true })

// Монтирование и размонтирование
onMounted(async () => {
  // Загружаем сохраненные данные
  const savedData = loadFromLocalStorage()
  
  // Отслеживание старта калькулятора
  if (!isCalculatorStarted.value) {
    trackEvent(YM_EVENTS.CALCULATOR_START, {
      has_saved_progress: !!savedData,
      entry_point: 'direct'
    })
    isCalculatorStarted.value = true
    calculatorStartTime = Date.now()
    
    // Начинаем таймер для первого шага
    const stepName = getStepName(currentQuestionIndex.value, questions)
    stepTimer.startStep(stepName)
  }
  
  if (savedData) {
    // Восстанавливаем состояние
    currentQuestionIndex.value = savedData.currentQuestionIndex || 0
    showResults.value = savedData.showResults || false
    
    // Восстанавливаем данные формы
    if (savedData.formData) {
      // Делаем глубокое слияние с дефолтными значениями
      const defaultData = getDefaultFormData()
      formData.value = {
        ...defaultData,
        ...savedData.formData,
        // Убедимся, что вложенные объекты тоже правильно слиты
        applicationDate: {
          ...defaultData.applicationDate,
          ...(savedData.formData.applicationDate || {})
        },
        pregnancy: {
          ...defaultData.pregnancy,
          ...(savedData.formData.pregnancy || {})
        },
        detailedIncome: {
          ...defaultData.detailedIncome,
          ...(savedData.formData.detailedIncome || {})
        },
        transport: {
          ...defaultData.transport,
          ...(savedData.formData.transport || {})
        },
        propertyCheck: {
          ...defaultData.propertyCheck,
          ...(savedData.formData.propertyCheck || {})
        },
        propertyExceptions: {
          ...defaultData.propertyExceptions,
          ...(savedData.formData.propertyExceptions || {})
        },
        adultsIncome: {
          ...defaultData.adultsIncome,
          ...(savedData.formData.adultsIncome || {})
        },
        validReasons: {
          ...defaultData.validReasons,
          ...(savedData.formData.validReasons || {})
        },
        selfEmployed: {
          ...defaultData.selfEmployed,
          ...(savedData.formData.selfEmployed || {})
        },
        alimony: {
          ...defaultData.alimony,
          ...(savedData.formData.alimony || {})
        },
        special: {
          ...defaultData.special,
          ...(savedData.formData.special || {})
        }
      }
    }
    
    // Отслеживаем восстановление прогресса
    trackEvent(YM_EVENTS.PROGRESS_RESTORED, {
      restored_step: getStepName(currentQuestionIndex.value, questions),
      step_number: currentQuestionIndex.value + 1,
      hours_since_save: Math.round((Date.now() - savedData.timestamp) / 3600000)
    })
    
    console.log('Восстановлен прогресс калькулятора')
  }
  
  // Добавляем слушатели событий - УБИРАЕМ обработчики касаний
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  // УБИРАЕМ эти строки:
  // window.addEventListener('touchstart', handleTouchStart, { passive: true })
  // window.addEventListener('touchmove', handleTouchMove, { passive: true })
  
  // Инициализируем значения
  isMobile.value = window.innerWidth <= 768
  lastScrollY = window.scrollY
  
  // Проверяем видимость калькулятора
  nextTick(() => {
    checkCalculatorVisibility()
  })
  
  // ИЗМЕНЕНО: Весь блок автоопределения заменен на логику подстановки из роута
  // Подстановка региона из роута (только если регион не был сохранен)
  if (!formData.value.region) {
    const regionSlugFromRoute = route.params.region;
    
    // Проверяем, что слаг из URL существует и соответствует одному из наших регионов
    if (regionSlugFromRoute && findRegionByCode(regionSlugFromRoute)) {
      formData.value.region = regionSlugFromRoute;
      isAutoDetected.value = true; // Используем этот флаг, чтобы показать сообщение "Регион определен автоматически"
      
      // Отслеживаем автоподстановку региона из URL
      trackEvent('calculator_region_from_route', {
        region: regionSlugFromRoute,
        success: true
      });
    }
  }
})

onUnmounted(() => {
  // Если пользователь уходит не дойдя до результата
  if (!showResults.value && currentQuestionIndex.value > 0) {
    trackEvent(YM_EVENTS.CALCULATOR_ABANDON, {
      last_step: getStepName(currentQuestionIndex.value, questions),
      step_number: currentQuestionIndex.value + 1,
      completion_percent: Math.round(((currentQuestionIndex.value + 1) / questions.length) * 100),
      time_spent: Math.round((Date.now() - calculatorStartTime) / 1000)
    })
  }
  
  stepTimer.endTimer()
  
  // Удаляем слушатели событий - УБИРАЕМ обработчики касаний
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  // УБИРАЕМ эти строки:
  // window.removeEventListener('touchstart', handleTouchStart)
  // window.removeEventListener('touchmove', handleTouchMove)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<template>
  <div class="smart-calculator" ref="calculatorRef">
    <div class="container">
      <!-- Основной контент -->
      <div class="content base-bg-color-two" ref="contentContainer">
        <span style="transform: translateY(-100px); position: absolute; top: 0;" id="calculator"></span>
        <!-- Прогресс -->
        <div class="progress-container" v-if="!showResults">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }"
            ></div>
          </div>
          <p class="progress-text">
            Вопрос <strong>{{ currentQuestionNumber }}</strong> из <strong>{{ totalQuestions }}</strong>
          </p>
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
              <!-- Комбинированное поле поиска и выбора -->
              <div class="select-wrapper" v-click-outside="closeRegionDropdown">
                <!-- Поле ввода, которое также работает как триггер -->
                <div class="search-trigger-wrapper">
                  <input 
                    type="text"
                    v-model="regionSearch"
                    placeholder="Начните вводить название региона..."
                    class="region-search-input"
                    @focus="showRegionDropdown = true"
                    @input="handleRegionSearch"
                    ref="regionSearchInput"
                  />
                  <div class="dropdown-arrow" :class="{ 'rotated': showRegionDropdown }" @click="toggleDropdown">
                    ▼
                  </div>
                </div>
                
                <!-- Выпадающий список регионов -->
                <div v-if="showRegionDropdown" class="region-dropdown">
                  <div class="region-list">
                    <div
                      v-for="region in filteredRegions"
                      :key="region.code"
                      class="region-option"
                      :class="{ 'selected': formData.region === region.code }"
                      @click="selectRegion(region)"
                    >
                      <span class="region-name">{{ region.name }}</span>
                      <span class="region-pm">ПМ: {{ formatAmount(region.pmValue) }} ₽</span>
                    </div>
                    
                    <div v-if="filteredRegions.length === 0" class="no-results">
                      Регионы не найдены. Попробуйте изменить запрос.
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="formData.region && isAutoDetected" class="success-message">
                ✓ Регион определен автоматически
              </div>
              
              <!-- Отображение выбранного региона -->
              <div v-if="formData.region && !showRegionDropdown" class="selected-region-display">
                <strong>Выбран регион:</strong> {{ selectedRegionName }} (ПМ: {{ formatAmount(currentRegionPM) }} ₽)
              </div>
            </div>

            <!-- Выбор месяца подачи заявления -->
            <div class="date-selection">
              <h3 class="subsection-title">Когда планируете подать заявление?</h3>
              <div class="date-inputs">
                <select v-model="formData.applicationDate.month" class="month-select">
                  <option v-for="month in months" :key="month.value" :value="month.value">
                    {{ month.label }}
                  </option>
                </select>
                <select v-model="formData.applicationDate.year" class="year-select">
                  <option :value="currentYear">{{ currentYear }}</option>
                  <option :value="currentYear + 1">{{ currentYear + 1 }}</option>
                </select>
              </div>
              <p class="hint-text light-text">
                Расчетный период для доходов: 
                <strong>{{ calculationPeriod.displayStart }} — {{ calculationPeriod.displayEnd }}</strong>
              </p>
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
                  <div class="option-icon">
                    <IconOne />
                  </div>
                  <div class="option-text">
                    <h3>Беременная женщина</h3>
                    <p>Срок от 6 недель, встала на учет до 12 недель</p>
                  </div>
                </div>
              </label>

              <label class="option-card" :class="{ 'selected': formData.recipientType === 'parent' }">
                <input type="radio" v-model="formData.recipientType" value="parent" />
                <div class="option-content">
                  <div class="option-icon">
                    <IconTwo />
                  </div>
                  <div class="option-text">
                    <h3>Родитель с детьми</h3>
                    <p>Дети до 17 лет (до дня 17-летия)</p>
                  </div>
                </div>
              </label>

              <label class="option-card" :class="{ 'selected': formData.recipientType === 'both' }">
                <input type="radio" v-model="formData.recipientType" value="both" />
                <div class="option-content">
                  <div class="option-icon">
                    <IconThree />
                  </div>
                  <div class="option-text">
                    <h3>Беременная женщина с детьми</h3>
                    <p>Беременная женщина, у которой уже есть дети</p>
                  </div>
                </div>
              </label>
            </div>
            
            <!-- Детали для беременных -->
            <div v-if="formData.recipientType === 'pregnant' || formData.recipientType === 'both'" class="pregnancy-details">
              <h3 class="subsection-title">Информация о беременности</h3>
              <div class="pregnancy-inputs">
                <div class="input-group">
                  <label>Текущая неделя беременности:</label>
                  <input type="number" v-model.number="formData.pregnancy.currentWeek" min="6" max="42" class="week-input" />
                </div>
                <div class="input-group">
                  <label>На какой неделе встали на учет:</label>
                  <input type="number" v-model.number="formData.pregnancy.registrationWeek" min="1" max="42" class="week-input" />
                </div>
              </div>
              <p class="hint-text light-text">
                ⚠️ Важно: пособие назначается с 6 недели беременности при постановке на учет до 12 недель
              </p>
            </div>
          </div>

          <!-- Шаг 3: Состав семьи -->
          <div v-if="currentQuestion === 'family'" class="family-step">
            <h2 class="step-title dark-text">Состав вашей семьи</h2>
            <p class="step-description light-text">
              Учитывается заявитель, его супруг(а) и дети. Бабушки, дедушки и другие родственники не включаются.
            </p>
            
            <div class="family-grid">
              <!-- Дети -->
              <div class="family-block">
                <h3 class="block-title">Дети</h3>
                <div class="counter-row">
                  <label>Количество детей до 17 лет:</label>
                  <div class="input-numbers">
                    <button class="minus" @click="decrementChildren" :disabled="formData.childrenCount <= 0">-</button>
                    <input type="number" v-model.number="formData.childrenCount" min="0" max="10" class="number-input" />
                    <button class="plus" @click="incrementChildren">+</button>
                  </div>
                </div>
                
                <div class="counter-row" style="margin-top: 20px;">
                  <label>Дети-студенты 18-23 лет:</label>
                  <div class="input-numbers">
                    <button @click="formData.studentChildrenCount--" :disabled="formData.studentChildrenCount <= 0">-</button>
                    <input type="number" v-model.number="formData.studentChildrenCount" min="0" max="5" class="number-input" />
                    <button @click="formData.studentChildrenCount++" :disabled="formData.studentChildrenCount >= 5">+</button>
                  </div>
                </div>
                <p class="hint-text light-text">
                  Учитываются дети до 23 лет, если они учатся очно и не в браке. Дети до 17 лет учитываются до дня их 17-летия.
                </p>
              </div>

              <!-- Взрослые -->
              <div class="family-block">
                <h3 class="block-title">Взрослые</h3>
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.hasSpouse" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Есть супруг(а)</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.special.singleParent" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Я единственный родитель</span>
                </label>
                <p class="hint-text light-text" v-if="formData.special.singleParent">
                  Единственный родитель освобождается от правила нулевого дохода
                </p>
              </div>
            </div>

            <!-- Итоговый состав -->
            <div class="family-summary">
              <p class="summary-text">
                <strong>Всего в семье: {{ totalFamilyMembers }} {{ getFamilyWord(totalFamilyMembers) }}</strong>
              </p>
              <p class="hint-text light-text">
                Доход будет делиться на {{ totalFamilyMembers }} для расчета среднедушевого дохода.
              </p>
              <div v-if="isLargeFamily" class="info-badge success">
                ✓ Многодетная семья (освобождение от правила нулевого дохода)
              </div>
            </div>
          </div>

          <!-- Шаг 4: Доход семьи -->
          <div v-if="currentQuestion === 'income'" class="income-step">
            <h2 class="step-title dark-text">Доходы вашей семьи</h2>
            <p class="step-description light-text">
              Укажите доходы всех членов семьи за период: <strong>{{ calculationPeriod.displayStart }} — {{ calculationPeriod.displayEnd }}</strong>
            </p>
            
            <!-- Быстрый ввод общей суммы -->
            <div class="income-input-block">
              <label>Общий доход семьи за расчетный период:</label>
              <div class="big-input-wrapper">
                <input 
                  type="number" 
                  v-model.number="formData.totalIncome" 
                  placeholder="Например: 600000"
                  class="big-income-input"
                />
                <span class="currency">₽</span>
              </div>
            </div>

            <!-- Детализация доходов -->
            <details class="income-details-section">
              <summary class="details-toggle">Детализировать доходы по источникам</summary>
              <div class="detailed-income-grid">
                <div class="income-item">
                  <label>Зарплаты:</label>
                  <input type="number" v-model.number="formData.detailedIncome.salary" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Доходы от бизнеса:</label>
                  <input type="number" v-model.number="formData.detailedIncome.business" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Доходы от аренды:</label>
                  <input type="number" v-model.number="formData.detailedIncome.rental" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Алименты получаемые:</label>
                  <input type="number" v-model.number="formData.detailedIncome.alimony" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Пособия и выплаты:</label>
                  <input type="number" v-model.number="formData.detailedIncome.benefits" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Пенсии:</label>
                  <input type="number" v-model.number="formData.detailedIncome.pension" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Стипендии:</label>
                  <input type="number" v-model.number="formData.detailedIncome.scholarship" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Доходы от ценных бумаг:</label>
                  <input type="number" v-model.number="formData.detailedIncome.securities" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Проценты по вкладам:</label>
                  <input type="number" v-model.number="formData.detailedIncome.interest" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Выигрыши в лотереях:</label>
                  <input type="number" v-model.number="formData.detailedIncome.lottery" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Денежные подарки/наследство:</label>
                  <input type="number" v-model.number="formData.detailedIncome.gifts" placeholder="0" />
                </div>
                <div class="income-item">
                  <label>Прочие доходы:</label>
                  <input type="number" v-model.number="formData.detailedIncome.other" placeholder="0" />
                </div>
              </div>
              <div class="total-calculated">
                Итого из детализации: <strong>{{ formatAmount(calculatedTotalIncome) }} ₽</strong>
              </div>
            </details>

            <div class="important-info">
              <strong>💡 Важная информация:</strong>
              <ul>
                <li>Не включайте выплаты мобилизованным членам семьи</li>
                <li>Не включайте единовременные выплаты в связи с ЧС</li>
                <li>Не включайте региональный материнский капитал</li>
                <li>Не включайте налоговые вычеты</li>
                <li>Включайте зарплаты до вычета налогов</li>
              </ul>
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
          </div>

          <!-- Шаг 5: Транспорт -->
          <div v-if="currentQuestion === 'transport'" class="transport-step">
            <h2 class="step-title dark-text">Транспортные средства семьи</h2>
            <p class="step-description light-text">
              Укажите все транспортные средства в собственности членов семьи
            </p>
            
            <div class="transport-grid">
              <!-- Автомобили -->
              <div class="transport-block">
                <h3 class="block-title">🚗 Автомобили</h3>
                <div class="counter-row">
                  <label>Количество автомобилей:</label>
                  <div class="input-numbers">
                    <button @click="formData.transport.carsCount > 0 && formData.transport.carsCount--">-</button>
                    <input type="number" v-model.number="formData.transport.carsCount" min="0" class="number-input" />
                    <button @click="formData.transport.carsCount++">+</button>
                  </div>
                </div>
                
                <div v-if="formData.transport.carsCount > 0" class="additional-checks">
                  <label class="custom-checkbox">
                    <input type="checkbox" v-model="formData.transport.hasLuxuryCar" />
                    <span class="checkmark"></span>
                    <span class="checkbox-text">
                      Есть автомобиль мощнее 250 л.с. младше 5 лет
                    </span>
                  </label>
                </div>
                <p class="hint-text light-text">
                  Лимит: 1 автомобиль (2 для многодетных или семей с инвалидом)
                </p>
              </div>

              <!-- Мотоциклы -->
              <div class="transport-block">
                <h3 class="block-title">🏍️ Мотоциклы</h3>
                <div class="counter-row">
                  <label>Количество мотоциклов:</label>
                  <div class="input-numbers">
                    <button @click="formData.transport.motorcyclesCount > 0 && formData.transport.motorcyclesCount--">-</button>
                    <input type="number" v-model.number="formData.transport.motorcyclesCount" min="0" class="number-input" />
                    <button @click="formData.transport.motorcyclesCount++">+</button>
                  </div>
                </div>
                <p class="hint-text light-text">
                  Лимит: 1 мотоцикл (2 для многодетных или семей с инвалидом)
                </p>
              </div>

              <!-- Водный транспорт -->
              <div class="transport-block">
                <h3 class="block-title">🚤 Водный транспорт</h3>
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.transport.hasBoat" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">
                    Есть катер или моторная лодка мощнее 5 л.с.
                  </span>
                </label>
              </div>

              <!-- Спецтехника -->
              <div class="transport-block">
                <h3 class="block-title">🚜 Спецтехника</h3>
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.transport.hasSelfPropelled" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">
                    Есть самоходная техника младше 5 лет
                  </span>
                </label>
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.transport.hasTractor" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">
                    Есть трактор или комбайн младше 5 лет
                  </span>
                </label>
              </div>
            </div>

            <!-- Исключения -->
            <div class="exception-block">
              <p class="exception-title">Не учитывается:</p>
              <label class="custom-checkbox">
                <input type="checkbox" v-model="formData.transport.transportFromSocial" />
                <span class="checkmark"></span>
                <span class="checkbox-text">
                  Транспорт получен через органы соцзащиты
                </span>
              </label>
            </div>
          </div>

          <!-- Шаг 6: Имущество -->
          <div v-if="currentQuestion === 'property'" class="property-step">
            <h2 class="step-title dark-text">Недвижимость и земельные участки</h2>
            <p class="step-description light-text">
              Укажите всю недвижимость в собственности членов семьи
            </p>
            
            <div class="property-grid">
              <!-- Квартиры -->
              <div class="property-block">
                <h3 class="block-title">🏢 Квартиры</h3>
                <div class="counter-row">
                  <label>Количество квартир:</label>
                  <div class="input-numbers">
                    <button @click="formData.propertyCheck.apartmentsCount > 0 && formData.propertyCheck.apartmentsCount--">-</button>
                    <input type="number" v-model.number="formData.propertyCheck.apartmentsCount" min="0" class="number-input" />
                    <button @click="formData.propertyCheck.apartmentsCount++">+</button>
                  </div>
                </div>
                <div v-if="formData.propertyCheck.apartmentsCount > 1" class="area-input">
                  <label>Общая площадь всех квартир (кв.м.):</label>
                  <input type="number" v-model.number="formData.propertyCheck.totalApartmentArea" placeholder="Например: 75" />
                  <p class="hint-text light-text">
                    При нескольких квартирах: не более 24 кв.м. на человека
                  </p>
                </div>
                <p class="hint-text light-text" v-if="formData.propertyCheck.apartmentsCount === 1">
                  ✓ Одна квартира любой площади разрешена
                </p>
              </div>

              <!-- Дома -->
              <div class="property-block">
                <h3 class="block-title">🏠 Жилые дома</h3>
                <div class="counter-row">
                  <label>Количество домов:</label>
                  <div class="input-numbers">
                    <button @click="formData.propertyCheck.housesCount > 0 && formData.propertyCheck.housesCount--">-</button>
                    <input type="number" v-model.number="formData.propertyCheck.housesCount" min="0" class="number-input" />
                    <button @click="formData.propertyCheck.housesCount++">+</button>
                  </div>
                </div>
                <div v-if="formData.propertyCheck.housesCount > 1" class="area-input">
                  <label>Общая площадь всех домов (кв.м.):</label>
                  <input type="number" v-model.number="formData.propertyCheck.totalHouseArea" placeholder="Например: 120" />
                  <p class="hint-text light-text">
                    При нескольких домах: не более 40 кв.м. на человека
                  </p>
                </div>
                <p class="hint-text light-text" v-if="formData.propertyCheck.housesCount === 1">
                  ✓ Один дом любой площади разрешен
                </p>
                
                <label class="custom-checkbox" style="margin-top: 15px;">
                  <input type="checkbox" v-model="formData.propertyCheck.hasCountryHouse" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Есть дача или садовый дом</span>
                </label>
                <p class="hint-text light-text" v-if="formData.propertyCheck.hasCountryHouse">
                  ⚠️ Нельзя иметь одновременно жилой дом и дачу
                </p>
              </div>

              <!-- Гаражи -->
              <div class="property-block">
                <h3 class="block-title">🚗 Гаражи и машино-места</h3>
                <div class="counter-row">
                  <label>Количество гаражей:</label>
                  <div class="input-numbers">
                    <button @click="formData.propertyCheck.garagesCount > 0 && formData.propertyCheck.garagesCount--">-</button>
                    <input type="number" v-model.number="formData.propertyCheck.garagesCount" min="0" class="number-input" />
                    <button @click="formData.propertyCheck.garagesCount++">+</button>
                  </div>
                </div>
                <p class="hint-text light-text">
                  Лимит: 1 гараж (2 для многодетных или семей с инвалидом)
                </p>
              </div>

              <!-- Земельные участки -->
              <div class="property-block">
                <h3 class="block-title">🌍 Земельные участки</h3>
                <div class="area-input">
                  <label>Площадь участков в городе (га):</label>
                  <input type="number" step="0.01" v-model.number="formData.propertyCheck.landAreaCity" placeholder="Максимум 0.25" />
                </div>
                <div class="area-input" style="margin-top: 15px;">
                  <label>Площадь участков в селе (га):</label>
                  <input type="number" step="0.01" v-model.number="formData.propertyCheck.landAreaRural" placeholder="Максимум 1" />
                </div>
                <p class="hint-text light-text">
                  Лимиты: в городе до 0.25 га, в селе до 1 га
                </p>
              </div>

              <!-- Нежилые помещения -->
              <div class="property-block">
                <h3 class="block-title">🏢 Нежилые помещения</h3>
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.propertyCheck.hasNonResidential" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">
                    Есть нежилое помещение (кроме гаражей, хозпостроек на ЛПХ)
                  </span>
                </label>
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.propertyCheck.hasCommercialProperty" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">
                    Есть коммерческая недвижимость
                  </span>
                </label>
              </div>
            </div>

            <!-- Исключения по имуществу -->
            <div class="exception-block">
              <p class="exception-title">Не учитывается при оценке имущества:</p>
              <label class="custom-checkbox">
                <input type="checkbox" v-model="formData.propertyExceptions.hasUninhabitableHousing" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Жилье признано непригодным для проживания</span>
              </label>
              <label class="custom-checkbox">
                <input type="checkbox" v-model="formData.propertyExceptions.hasArrestedProperty" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Имущество под арестом</span>
              </label>
              <label class="custom-checkbox">
                <input type="checkbox" v-model="formData.propertyExceptions.hasGuardianshipProperty" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Имущество детей под опекой</span>
              </label>
              <label class="custom-checkbox">
                <input type="checkbox" v-model="formData.propertyExceptions.hasFarEastHectare" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Дальневосточный гектар</span>
              </label>
              <label class="custom-checkbox">
                <input type="checkbox" v-model="formData.propertyExceptions.hasMultifamilySupport" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Жилье предоставлено многодетной семье как мера поддержки</span>
              </label>
              <label class="custom-checkbox">
                <input type="checkbox" v-model="formData.propertyExceptions.hasDisabledHousing" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Жилье для члена семьи с инвалидностью</span>
              </label>
            </div>
          </div>

          <!-- Шаг 7: Дополнительные условия -->
          <div v-if="currentQuestion === 'conditions'" class="conditions-step">
            <h2 class="step-title dark-text">Проверка дополнительных условий</h2>
            <p class="step-description light-text">
              Ответьте на вопросы для точного расчета пособия
            </p>
            
            <div class="conditions-list">
              <!-- Правило нулевого дохода -->
              <div class="condition-block" v-if="needsZeroIncomeCheck">
                <h3 class="condition-title">
                  ⚠️ Правило нулевого дохода
                </h3>
                <p class="condition-desc light-text">
                  Ваш доход ниже 30% от прожиточного минимума. Необходимо подтвердить уважительные причины отсутствия дохода.
                </p>
                
                <div v-if="isExemptFromZeroIncomeRule" class="info-badge success">
                  ✓ Вы освобождены от правила нулевого дохода:
                  <ul style="margin: 5px 0 0 20px;">
                    <li v-if="isPregnantRecipient">Беременная женщина</li>
                    <li v-if="isLargeFamily">Многодетная семья</li>
                    <li v-if="formData.special.singleParent">Единственный родитель</li>
                    <li v-if="formData.special.mobilized">Член семьи мобилизован</li>
                  </ul>
                </div>
                
                <div v-else class="zero-income-details">
                  <!-- Заявитель -->
                  <div class="person-income-block">
                    <h4>Заявитель</h4>
                    <label class="custom-checkbox">
                      <input type="checkbox" v-model="formData.adultsIncome.applicantHasIncome" />
                      <span class="checkmark"></span>
                      <span class="checkbox-text">Был доход в расчетном периоде</span>
                    </label>
                    
                    <div v-if="!formData.adultsIncome.applicantHasIncome" class="reasons-selector">
                      <p class="hint-text">Укажите месяцы и причины отсутствия дохода (минимум 10 из 12):</p>
                      <button @click="showReasonDetails = !showReasonDetails" class="toggle-reasons-btn">
                        {{ showReasonDetails ? 'Скрыть' : 'Показать' }} помесячную детализацию
                      </button>
                      
                      <div v-if="showReasonDetails" class="months-grid">
                        <div v-for="month in 12" :key="month" class="month-reason">
                          <label>Месяц {{ month }}:</label>
                          <select @change="(e) => e.target.value && addValidReason('applicant', month, e.target.value)">
                            <option value="">Был доход</option>
                            <option v-for="reason in validReasonsList" :key="reason.value" :value="reason.value">
                              {{ reason.label }}
                            </option>
                          </select>
                        </div>
                      </div>
                      
                      <div class="reason-summary">
                        Месяцев с уважительной причиной: 
                        <strong>{{ calculateValidReasonMonths(formData.adultsIncome.applicantReasons) }} из 10 требуемых</strong>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Супруг(а) -->
                  <div v-if="formData.hasSpouse" class="person-income-block">
                    <h4>Супруг(а)</h4>
                    <label class="custom-checkbox">
                      <input type="checkbox" v-model="formData.adultsIncome.spouseHasIncome" />
                      <span class="checkmark"></span>
                      <span class="checkbox-text">Был доход в расчетном периоде</span>
                    </label>
                    
                    <div v-if="!formData.adultsIncome.spouseHasIncome" class="reasons-selector">
                      <p class="hint-text">Укажите месяцы и причины отсутствия дохода (минимум 10 из 12):</p>
                      
                      <div class="reason-summary">
                        Месяцев с уважительной причиной: 
                        <strong>{{ calculateValidReasonMonths(formData.adultsIncome.spouseReasons) }} из 10 требуемых</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Самозанятые -->
              <div class="condition-block">
                <h3 class="condition-title">
                  💼 Самозанятость и ИП
                </h3>
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.selfEmployed.isSelfEmployed" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">В семье есть самозанятые или ИП</span>
                </label>
                
                <div v-if="formData.selfEmployed.isSelfEmployed" class="self-employed-details">
                  <div class="counter-row">
                    <label>Месяцев работы в расчетном периоде:</label>
                    <div class="input-numbers">
                      <button @click="formData.selfEmployed.monthsActive > 1 && formData.selfEmployed.monthsActive--">-</button>
                      <input type="number" v-model.number="formData.selfEmployed.monthsActive" min="1" max="12" class="number-input" />
                      <button @click="formData.selfEmployed.monthsActive < 12 && formData.selfEmployed.monthsActive++">+</button>
                    </div>
                  </div>
                  
                  <div class="income-input-block" style="margin-top: 15px;">
                    <label>Доход за период работы:</label>
                    <div class="big-input-wrapper">
                      <input type="number" v-model.number="formData.selfEmployed.yearlyIncome" :placeholder="`Минимум ${Math.round(44880 * formData.selfEmployed.monthsActive / 12)} ₽`" class="big-income-input" style="font-size: 18px; padding: 12px;"/>
                      <span class="currency">₽</span>
                    </div>
                    <p class="hint-text light-text">
                      Минимум 2 МРОТ за год работы (пропорционально месяцам)
                    </p>
                  </div>
                </div>
              </div>

              <!-- Алименты -->
              <div class="condition-block">
                <h3 class="condition-title">
                  💰 Алименты
                </h3>
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.alimony.receivesAlimony" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Семья получает алименты</span>
                </label>
                
                <div v-if="formData.alimony.receivesAlimony" class="alimony-details">
                  <div class="counter-row">
                    <label>На скольких детей:</label>
                    <div class="input-numbers">
                      <button @click="formData.alimony.childrenCount > 1 && formData.alimony.childrenCount--">-</button>
                      <input type="number" v-model.number="formData.alimony.childrenCount" min="1" max="10" class="number-input" />
                      <button @click="formData.alimony.childrenCount < 10 && formData.alimony.childrenCount++">+</button>
                    </div>
                  </div>
                  
                  <div class="income-input-block" style="margin-top: 15px;">
                    <label>Сумма алиментов в месяц:</label>
                    <div class="big-input-wrapper">
                      <input type="number" v-model.number="formData.alimony.monthlyAmount" placeholder="Например: 7500" class="big-income-input" style="font-size: 18px; padding: 12px;"/>
                      <span class="currency">₽</span>
                    </div>
                    <p class="hint-text light-text">
                      Минимум от МРОТ: 1 ребенок - 5 610 ₽, 2 детей - 7 480 ₽, 3+ детей - 11 220 ₽
                    </p>
                  </div>
                  
                  <label class="custom-checkbox" style="margin-top: 15px;">
                    <input type="checkbox" v-model="formData.alimony.isVoluntaryAgreement" />
                    <span class="checkmark"></span>
                    <span class="checkbox-text">
                      Алименты по добровольному соглашению (сумма может быть любой)
                    </span>
                  </label>
                </div>
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
                  <input type="checkbox" v-model="formData.special.hasDisabled" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">В семье есть инвалид</span>
                </label>

                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.special.mobilized" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Член семьи мобилизован</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.special.refugeeStatus" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Семья имеет статус беженцев</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.special.emergencySituation" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Пострадавшие от чрезвычайной ситуации</span>
                </label>
              </div>

              <!-- Уважительные причины (если нужны) -->
              <div class="condition-block" v-if="!isExemptFromZeroIncomeRule">
                <h3 class="condition-title">
                  📋 Уважительные причины отсутствия дохода
                </h3>
                <p class="condition-desc light-text">
                  Отметьте применимые причины для взрослых членов семьи
                </p>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.validReasons.childCareUnder3" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Уход за ребенком до 3 лет</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.validReasons.disabledCare" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Уход за инвалидом или ребенком-инвалидом</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.validReasons.elderCare" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Уход за пожилым человеком старше 80 лет</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.validReasons.fullTimeStudy" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Очное обучение (до 23 лет)</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.validReasons.unemployment" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Официальная безработица (не более 6 месяцев)</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.validReasons.longTermTreatment" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Длительное лечение (более 3 месяцев)</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.validReasons.militaryService" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Военная служба по призыву</span>
                </label>
                
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.validReasons.imprisonment" />
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Лишение свободы или нахождение под стражей</span>
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
          :class="{ 'pulse-attention': startPulsing }"
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
$primary: #4361EE;
$primary-hover: #3A56D4;
$success: #10B981;
$error: #EF4444;
$warning: #F59E0B;

$text-dark: #1E293B;
$text-light: #64748B;
$text-lighter: #94A3B8;

$bg-light: #F8FAFC;
$bg-lighter: #FFFFFF;
$border-color: #E2E8F0;
$shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
$shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.12);

// ===== ОСНОВНЫЕ СТИЛИ =====
.smart-calculator {
  width: 100%;
  max-width: 100%;
  background: linear-gradient(135deg, $bg-light 0%, #F1F5F9 100%);
  border-radius: 24px;
  padding: 2rem;
  margin: 1rem auto;
  box-shadow: $shadow;
}

.container {
  max-width: 700px;
  margin: 0 auto;
}

.content {
  padding: 2.5rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  background: $bg-lighter;
  box-shadow: $shadow;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $primary, #8B5CF6);
    border-radius: 2px 2px 0 0;
    @media (max-width: 768px) {
      background:none;
    }
  }
}

// ===== ПРОГРЕСС-БАР =====
.progress-container {
  margin-bottom: 2.5rem;
  text-align: center;
  
  .progress-bar {
    height: 8px;
    background-color: #E2E8F0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
    position: relative;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, $primary, #8B5CF6);
    border-radius: 4px;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 0 20px rgba(67, 97, 238, 0.3);
  }
  
  .progress-text {
    font-size: 0.9rem;
    color: $text-light;
    font-weight: 500;
    
    strong {
      color: $primary;
      font-weight: 600;
    }
  }
}

// ===== ЗАГОЛОВКИ =====
.step-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: $text-dark;
  text-align: center;
  background: linear-gradient(135deg, $text-dark 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-description {
  color: $text-light;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-align: center;
  font-size: 1.1rem;
}

.subsection-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 2rem 0 1.25rem 0;
  color: $text-dark;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: $primary;
    border-radius: 50%;
    display: inline-block;
  }
}

// ===== КАРТОЧКИ =====
.new-card-style {
  background: $bg-lighter;
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid $border-color;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    box-shadow: $shadow-hover;
    transform: translateY(-2px);
  }
  
  .block-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: $text-dark;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

// ===== КНОПКИ =====
.new-primary-button {
  background: linear-gradient(135deg, $primary 0%, #6172F3 100%);
  color: white;
  padding: 1.125rem 2.5rem;
  border-radius: 50px;
  border: none;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.25);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(67, 97, 238, 0.35);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #CBD5E1;
    box-shadow: none;
    transform: none;
    cursor: not-allowed;
    
    &::before {
      display: none;
    }
  }
}

.secondary-button {
  background: transparent;
  color: $text-light;
  padding: 1.125rem 2rem;
  border-radius: 50px;
  border: 2px solid $border-color;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    border-color: $primary;
    color: $primary;
    background: rgba(67, 97, 238, 0.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// ===== ПОЛЯ ВВОДА И СЕЛЕКТЫ =====
.new-input-style {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid $border-color;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: $bg-lighter;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: $text-lighter;
  }
}

// ===== КАРТОЧКИ ВЫБОРА =====
.option-card {
  display: block;
  padding: 1.5rem;
  border: 2px solid $border-color;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: $bg-lighter;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: transparent;
    transition: background 0.3s ease;
  }
  
  &:hover {
    border-color: $primary;
    transform: translateY(-2px);
    box-shadow: $shadow;
    
    &::before {
      background: $primary;
    }
  }
  
  &.selected {
    border-color: $primary;
    background: linear-gradient(135deg, #F0F5FF 0%, #EBF4FF 100%);
    
    &::before {
      background: $primary;
    }
    
    .option-icon {
      //background: rgba(67, 97, 238, 0.1);
      transform: scale(0.95);
    }
  }
  
  .option-content {
    display: flex;
    gap: 1.25rem;
    align-items: center;
  }
  
  .option-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    //background: $bg-light;
    border-radius: 14px;
    transition: all 0.3s ease;
    
    svg {
      width: 40px;
      height: 40px;
    }
  }
  
  .option-text {
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: $text-dark;
      font-weight: 600;
    }
    
    p {
      margin: 0;
      font-size: 0.95rem;
      color: $text-light;
      line-height: 1.5;
    }
  }
}

// ===== СЧЕТЧИКИ =====
.counter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
  
  label {
    font-size: 1rem;
    color: $text-dark;
    flex: 1;
    font-weight: 500;
  }
}

.input-numbers {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .number-input {
    width: 80px;
    height: 48px;
    border: 2px solid $border-color;
    border-radius: 12px;
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: $text-dark;
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    }
  }
  
  .counter-btn {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, $primary 0%, #6172F3 100%);
    color: white;
    border: none;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.25rem;
    font-weight: 600;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    &:disabled {
      background: #CBD5E1;
      transform: none;
      box-shadow: none;
      cursor: not-allowed;
    }
  }
}

// ===== ЧЕКБОКСЫ =====
.fancy-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding-left: 2.5rem;
  position: relative;
  line-height: 1.5;
  color: $text-dark;
  font-weight: 500;
  
  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    
    &:checked ~ .checkmark {
      background: $primary;
      border-color: $primary;
      
      &::after {
        transform: scale(1);
      }
    }
  }
  
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    background: $bg-lighter;
    border: 2px solid $border-color;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &::after {
      content: "";
      position: absolute;
      left: 7px;
      top: 3px;
      width: 6px;
      height: 12px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg) scale(0);
      transition: transform 0.2s ease;
    }
  }
  
  &:hover .checkmark {
    border-color: $primary;
  }
}

// ===== АНИМАЦИИ ПЕРЕХОДОВ =====
.fade-slide-leave-active,
.fade-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// ===== ИНФО-БЕЙДЖИ =====
.info-badge {
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
  border-left: 4px solid;
  
  &.success {
    background: rgba(16, 185, 129, 0.1);
    color: #047857;
    border-left-color: #10B981;
  }
  
  &.warning {
    background: rgba(245, 158, 11, 0.1);
    color: #B45309;
    border-left-color: #F59E0B;
  }
  
  &.error {
    background: rgba(239, 68, 68, 0.1);
    color: #B91C1C;
    border-left-color: #EF4444;
  }
}

// ===== КОНТРОЛЫ =====
.controls {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 0 0 0;
  background: transparent;
  
  // Убираем фиксированное позиционирование для всех устройств
  position: static;
  transform: none;
  opacity: 1;
  box-shadow: none !important;
  border-radius: 0;
  
  @media (max-width: 768px) {
    // На мобильных тоже статичное позиционирование
    position: static;
    background: transparent;
    padding: 1.5rem 0 0 0;
    box-shadow: none;
    border-radius: 0;
    
    // Убираем все анимации и трансформации
    transition: none;
    
    // Убираем класс hidden
    &.hidden {
      display: flex !important;
      opacity: 1 !important;
      transform: none !important;
      pointer-events: all !important;
    }
  }
}

// ===== МОБИЛЬНАЯ ВЕРСИЯ =====
@media (max-width: 768px) {
  .smart-calculator {
    padding: 1rem;
    border-radius: 20px;
    margin: 0.5rem auto;
  }
  
  .content {
    padding: 1.5rem;
    border-radius: 16px;
    // Убираем отступ снизу для мобильных
    padding-bottom: 1.5rem;
  }
  
  .step-title {
    font-size: 1.5rem;
  }
  
  .step-description {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .new-card-style {
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }
  
  .option-card {
    padding: 1.25rem;
    
    .option-icon {
      width: 48px;
      height: 48px;
      
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }
  
  .counter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .input-numbers {
    width: 100%;
    justify-content: space-between;
  }
}

// ===== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ =====
.floating-scroll-button {
  position: fixed;
  bottom: 100px;
  right: 20px;
  background: linear-gradient(135deg, $primary 0%, #6172F3 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  z-index: 1001;
  box-shadow: 0 8px 25px rgba(67, 97, 238, 0.35);
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(67, 97, 238, 0.4);
  }
  
  @media (max-width: 768px) {
    bottom: 90px;
    right: 15px;
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }
}

.hint-text {
  font-size: 0.9rem;
  margin-top: 0.75rem;
  color: $text-light;
  line-height: 1.5;
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: $text-light;
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid $border-color;
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}


.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 0;
  min-height: auto !important;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 1rem;
  flex-grow: 1;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

// Прогресс бар
.progress {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .progress-numbers {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 1.5rem;
    font-weight: 600;
    
    .one {
      color: #008CFF;
    }
    
    .dop {
      color: #A2AAB5;
    }
    
    .two {
      color: #E8EAED;
    }
  }
  
  .more {
    color: #A2AAB5;
    font-size: 0.9rem;
  }
}

// Заголовки
.step-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1A1D1F;
}

.step-description {
  color: #6F767E;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.subsection-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem 0;
  color: #1A1D1F;
}

// Выбор даты
.date-selection {
  background: #F6F7F9;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1.5rem;
  
  .date-inputs {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    
    select {
      padding: 0.75rem;
      border: 1.5px solid #E8EAED;
      border-radius: 8px;
      font-size: 0.95rem;
      background: white;
      cursor: pointer;
      transition: border-color 0.2s;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2348596D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 40px;
      
      // Фикс для IE
      &::-ms-expand {
        display: none;
      }
      
      // Фикс для Firefox
      @-moz-document url-prefix() {
        text-indent: 0.01px;
        text-overflow: '';
        padding-right: 40px;
      }
      
      &:focus {
        outline: none;
        border-color: #008CFF;
      }
    }
  }
}

// Селекты
.select-wrapper {
  position: relative;
  width: 100%;
}

.region-select {
  width: 100%;
  padding: 0.875rem;
  border: 1.5px solid #E8EAED;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236F767E' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  &:focus {
    outline: none;
    border-color: #008CFF;
  }
}

// Карточки выбора
.recipient-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-card {
  display: block;
  padding: 1.25rem;
  border: 2px solid #F0F2F5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #008CFF;
    background: #F8FBFF;
  }
  
  &.selected {
    border-color: #008CFF;
    background: #F0F7FF;
  }
  
  input[type="radio"] {
    display: none;
  }
  
  .option-content {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .option-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }
  
  .option-text {
    h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      color: #1A1D1F;
    }
    
    p {
      margin: 0;
      font-size: 0.875rem;
      color: #6F767E;
    }
  }
}

// Детали беременности
.pregnancy-details {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #FFF9E6;
  border-radius: 12px;
  border: 1px solid #FFD166;
  
  .pregnancy-inputs {
    display: grid;
    gap: 1rem;
    
    .input-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      label {
        font-size: 0.9rem;
        color: #1A1D1F;
      }
      
      .week-input {
        width: 80px;
        padding: 0.5rem;
        border: 1.5px solid #E8EAED;
        border-radius: 6px;
        text-align: center;
        font-size: 0.95rem;
      }
    }
  }
}

// Блоки семьи
.family-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.family-block {
  padding: 1.5rem;
  background: #F6F7F9;
  border-radius: 12px;
  
  .block-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1A1D1F;
  }
}

.counter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  
  label {
    font-size: 0.95rem;
    color: #1A1D1F;
    flex: 1;
  }
}

// Счетчики
.input-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .number-input {
    width: 60px;
    height: 40px;
    border: 1.5px solid #E8EAED;
    border-radius: 6px;
    text-align: center;
    font-size: 1rem;
    -moz-appearance: textfield;
    
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
  
  button {
    width: 36px;
    height: 36px;
    background-color: #008CFF;
    color: white;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1.1rem;
    
    &:hover:not(:disabled) {
      background-color: #0070CC;
    }
    
    &:disabled {
      background-color: #E8EAED;
      cursor: not-allowed;
    }
  }
}

// Чекбоксы
.custom-checkbox {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  padding-left: 2rem;
  position: relative;
  line-height: 1.4;
  
  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    
    &:checked ~ .checkmark {
      background-color: #008CFF;
      border-color: #008CFF;
      
      &:after {
        display: block;
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
    border: 1.5px solid #E8EAED;
    border-radius: 4px;
    
    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
}

// Итог семьи
.family-summary {
  padding: 1.25rem;
  background: #F0F7FF;
  border-radius: 12px;
  text-align: center;
  
  .summary-text {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }
}

// Бейджи
.info-badge {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  
  &.success {
    background: #ECFDF3;
    color: #047857;
    border: 1px solid #A7F3D0;
  }
}

// Ввод дохода
.income-input-block {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
    color: #1A1D1F;
  }
}

.big-input-wrapper {
  position: relative;
  
  .big-income-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #E8EAED;
    border-radius: 8px;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1A1D1F;
    
    &:focus {
      outline: none;
      border-color: #008CFF;
    }
  }
  
  .currency {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    color: #6F767E;
  }
}

// Детализация доходов
.income-details-section {
  margin-top: 1.5rem;
  
  .details-toggle {
    width: 100%;
    padding: 0.875rem;
    background: white;
    border: 1.5px solid #E8EAED;
    border-radius: 8px;
    color: #008CFF;
    font-size: 0.9rem;
    cursor: pointer;
    text-align: left;
    margin-bottom: 1.5rem;
    &:hover {
      background: #F6F7F9;
    }
  }
  
  .detailed-income-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1.5rem;
    background: #F6F7F9;
    border-radius: 12px;
    margin-top: 1rem;
    
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
    
    .income-item {
      label {
        display: block;
        font-size: 0.875rem;
        color: #6F767E;
        margin-bottom: 0.5rem;
      }
      
      input {
        width: 100%;
        padding: 0.5rem;
        border: 1.5px solid #E8EAED;
        border-radius: 6px;
        font-size: 0.9rem;
        
        &:focus {
          outline: none;
          border-color: #008CFF;
        }
      }
    }
  }
  
  .total-calculated {
    margin-top: 1rem;
    padding: 1rem;
    background: #F0F7FF;
    border-radius: 8px;
    text-align: center;
    font-size: 1rem;
    
    strong {
      color: #008CFF;
    }
  }
}

// Важная информация
.important-info {
  background: #F0F7FF;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  
  strong {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  ul {
    margin: 0;
    padding-left: 1.25rem;
    
    li {
      margin-bottom: 0.25rem;
    }
  }
}

.hint-text {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: #6F767E;
}

// Предпросмотр расчета
.income-calculator-preview {
  padding: 1.5rem;
  background: #F6F7F9;
  border-radius: 12px;
  border: 1.5px solid #E8EAED;
  margin-bottom: 1.5rem;
  
  .calc-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    
    .calc-value {
      font-weight: 600;
      
      &.success {
        color: #10B981;
      }
      
      &.error {
        color: #EF4444;
      }
    }
  }
  
  .income-status {
    margin-top: 1rem;
    padding: 0.875rem;
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
    
    &.success {
      background: #ECFDF3;
      color: #047857;
    }
    
    &.error {
      background: #FEF2F2;
      color: #DC2626;
    }
  }
}

// Транспорт и недвижимость
.transport-grid,
.property-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.transport-block,
.property-block {
  padding: 1.5rem;
  background: #F6F7F9;
  border-radius: 12px;
  
  .block-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1A1D1F;
  }
}

// Поля ввода площади
.area-input {
  margin-top: 1rem;
  
  label {
    display: block;
    font-size: 0.875rem;
    color: #6F767E;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1.5px solid #E8EAED;
    border-radius: 8px;
    font-size: 0.95rem;
    
    &:focus {
      outline: none;
      border-color: #008CFF;
    }
  }
}

// Блок исключений
.exception-block {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #F0F7FF;
  border-radius: 12px;
  
  .exception-title {
    font-size: 1rem;
    font-weight: 600;
    color: #008CFF;
    margin-bottom: 1rem;
  }
}

// Блоки условий
.conditions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.condition-block {
  padding: 1.5rem;
  background: #F6F7F9;
  border-radius: 12px;
  
  .condition-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1A1D1F;
  }
  
  .condition-desc {
    font-size: 0.9rem;
    margin-bottom: 1rem;
    color: #6F767E;
  }
}

// Кнопки управления
.controls {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
  
  // Скрываем контролы только на мобильных при скролле
  @media (max-width: 768px) {
    transition: all 0.3s ease;
    
    &.hidden {
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }
  }
}

.big-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #F6F7F9;
  color: #6F767E;
  
  &:hover:not(:disabled) {
    background: #E8EAED;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.primary {
    background: #008CFF !important;
    color: white;
    
    &:hover:not(:disabled) {
      background: #0070CC !important;
    }
  }
}

// Анимации
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6F767E;
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #E8EAED;
    border-top-color: #008CFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.success-message {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #ECFDF3;
  border-radius: 8px;
  color: #047857;
  font-size: 0.875rem;
}

.progress-container {
  margin-bottom: 2.5rem;
  text-align: center;
  
  .progress-bar {
    height: 8px;
    background-color: #E2E8F0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
    position: relative;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4361EE, #8B5CF6);
    border-radius: 4px;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 0 20px rgba(67, 97, 238, 0.3);
  }
  
  .progress-text {
    font-size: 0.9rem;
    color: #64748B;
    font-weight: 500;
    
    strong {
      color: #4361EE;
      font-weight: 600;
    }
  }
}

@media (max-width: 768px) {
  .progress-container {
    margin-bottom: 1.25rem;
    
    .progress-bar {
      height: 6px;
      margin-bottom: 0.75rem;
    }
    
    .progress-text {
      font-size: 0.8rem;
    }
  }
}

// МОБИЛЬНАЯ ВЕРСИЯ - КОМПАКТНАЯ
@media (max-width: 768px) {
  .smart-calculator {
    font-size: 14px;
    min-height: 100vh;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #F6F7F9;
  }

  .container {
    padding: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .content {
    padding: 1rem;
    border-radius: 0;
    margin-bottom: 0;
    box-shadow: none;
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 80px;
  }

  // Уменьшаем все большие заголовки
  .step-title {
    font-size: 1.3rem !important;
    margin-bottom: 0.5rem;
  }

  .step-description {
    font-size: 0.85rem;
    margin-bottom: 1.25rem;
  }

  .subsection-title {
    font-size: 1rem;
    margin: 1rem 0 0.75rem 0;
  }

  // Уменьшаем отступы в блоках
  .family-block,
  .transport-block,
  .property-block,
  .condition-block,
  .date-selection,
  .pregnancy-details,
  .exception-block {
    padding: 1rem !important;
    margin-bottom: 1rem;
  }

  // Делаем сетки одноколоночными
  .transport-grid,
  .property-grid {
    grid-template-columns: 1fr !important;
    gap: 0.75rem;
  }

  // Уменьшаем элементы форм
  input[type="number"],
  input[type="text"],
  select {
    padding: 0.5rem !important;
    font-size: 0.9rem !important;
  }

  // Компактные кнопки счетчиков
  .input-numbers {
    button {
      width: 32px !important;
      height: 32px !important;
      font-size: 1rem !important;
    }
    .number-input {
      width: 50px !important;
      height: 32px !important;
      font-size: 0.9rem !important;
    }
  }

  // Уменьшаем большие поля ввода
  .big-input-wrapper .big-income-input {
    font-size: 1.2rem !important;
    padding: 0.75rem !important;
  }

  .big-input-wrapper .currency {
    font-size: 1.2rem !important;
    right: 0.75rem;
  }

  // Компактные карточки выбора
  .recipient-options {
    gap: 0.5rem;
  }

  .option-card {
    padding: 0.875rem !important;
    margin-bottom: 0.5rem;

    .option-content {
      gap: 0.5rem;
    }

    .option-icon svg {
      width: 30px;
      height: 30px;
    }

    .option-text h3 {
      font-size: 0.9rem;
      margin-bottom: 0.2rem;
    }

    .option-text p {
      font-size: 0.75rem;
    }
  }

  // Уменьшаем чекбоксы
  .custom-checkbox {
    font-size: 0.85rem;
    margin-bottom: 0.6rem;
    padding-left: 1.5rem;

    .checkmark {
      width: 16px;
      height: 16px;
      top: 0.1rem;

      &:after {
        left: 4px;
        top: 0;
        width: 4px;
        height: 8px;
      }
    }
  }

  // Компактный прогресс-бар
  .progress {
    margin-bottom: 1.25rem;

    .progress-numbers {
      font-size: 1.1rem;
      gap: 0.2rem;
    }

    .more {
      font-size: 0.75rem;
    }
  }

  // Выбор даты в колонку
  .date-selection .date-inputs {
    flex-direction: column;
    gap: 0.5rem;
    
    select {
      width: 100%;
    }
  }

  // Счетчики в колонку
  .counter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    
    .input-numbers {
      width: 100%;
      justify-content: flex-start;
    }
  }

  // Детализация доходов компактная
  .income-details-section {
    .detailed-income-grid {
      grid-template-columns: 1fr !important;
      padding: 1rem !important;
      gap: 0.75rem;
    }
    
    .income-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      
      label {
        flex: 1;
        margin-bottom: 0 !important;
        font-size: 0.8rem !important;
      }
      
      input {
        width: 40% !important;
        min-width: 70px;
        padding: 0.4rem !important;
      }
    }
  }

  // Фиксированная панель управления
  .controls {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 0.75rem 1rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    border-radius: 0;
    
    .big-button {
      padding: 0.75rem;
      font-size: 0.9rem;
      flex: 1;
      min-width: 0;
    }
  }

  // Уменьшаем информационные блоки
  .important-info,
  .family-summary,
  .income-calculator-preview {
    padding: 1rem !important;
    font-size: 0.85rem;
  }

  .info-badge {
    padding: 0.5rem;
    font-size: 0.8rem;
    
    ul {
      margin: 0.25rem 0 0 1rem;
      
      li {
        font-size: 0.8rem;
      }
    }
  }

  // Уменьшаем подсказки
  .hint-text {
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  // Детали беременности компактные
  .pregnancy-details .pregnancy-inputs .input-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    
    .week-input {
      width: 100%;
      max-width: 80px;
    }
  }

  // Улучшаем отображение длинных списков условий
  .conditions-list {
    gap: 1rem;
    
    .condition-block {
      padding: 1rem;
      
      .condition-title {
        font-size: 1rem;
      }
      
      .condition-desc {
        font-size: 0.8rem;
      }
    }
  }
}

// Еще более компактная версия для очень маленьких экранов
@media (max-width: 768px) {
  .smart-calculator {
    min-height: unset !important; // Убираем минимальную высоту
    height: auto !important;
    padding: 0 !important; // Убираем отступы
    margin: 0 !important; // Убираем внешние отступы
    background: #F6F7F9;
    border-radius: 0;
  }

  .container {
    padding: 0;
    min-height: unset !important;
    height: auto;
  }

  .content {
    padding: 1rem;
    border-radius: 0;
    margin-bottom: 0;
    box-shadow: none;
    min-height: unset !important;
    overflow: visible;
    padding-bottom: 80px;
  }

  
  .step-title {
    font-size: 1.2rem !important;
  }
  
  .controls {
    padding: 0.5rem;
    
    .big-button {
      padding: 1.3rem;
      font-size: 0.99rem;
      background: rgb(195, 192, 243);
    }
  }
  
  .option-card {
    padding: 0.75rem !important;
    
    .option-icon svg {
      width: 30px;
      height: 30px;
    }
  }
}

@media (max-width: 768px) {
  .floating-scroll-button {
    bottom: 80px; // Выше мобильных контролов
    right: 10px;
    padding: 10px 14px;
    font-size: 12px;
  }
  
  .smart-calculator.sticky {
    position: relative;
    top: 0;
    box-shadow: none;
    
    .container {
      border-radius: 0;
    }
    
    .content {
      border-radius: 0;
    }
  }
}

@media (max-width: 768px) {
  .controls {
    transition: all 0.3s ease;
    transform: translateY(0);
    opacity: 1;
    
    &.hidden {
      opacity: 0;
      transform: translateY(100%);
      pointer-events: none;
    }
  }
}

// Для очень маленьких экранов
@media (max-width: 360px) {
  .floating-scroll-button {
    bottom: 70px;
    right: 5px;
    padding: 8px 12px;
    font-size: 11px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
}

@media (max-width: 768px) {
  .smart-calculator {
    min-height: 100vh;
    height: auto;
    overflow: visible;
    background: #F6F7F9;
  }

  .container {
    min-height: 100vh;
    height: auto;
    overflow: visible;
  }

  .content {
    overflow: visible;
    // Убираем фиксированный отступ для контролов
    padding-bottom: 1.5rem;
    min-height: auto;
  }

  // УБИРАЕМ фиксированное позиционирование контролов
  .controls {
    position: static;
    transform: none;
    opacity: 1;
    
    &.hidden {
      display: flex !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
}

/* Убираем все трансформации и неправильные позиционирования */
.floating-scroll-button {
  position: fixed;
  bottom: 90px;
  right: 15px;
  z-index: 1001;
  transition: all 0.3s ease;
}

/* Исправляем z-index для предотвращения наложения */
.content {
  position: relative;
  z-index: 1;
}

.controls {
  z-index: 2;
}

// Стили для помесячной детализации
.toggle-reasons-btn {
  width: 100%;
  padding: 0.875rem;
  background: white;
  border: 1.5px solid #E8EAED;
  border-radius: 8px;
  color: #008CFF;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: center;
  margin: 1rem 0;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F6F7F9;
    border-color: #008CFF;
  }
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #F8FBFF;
  border-radius: 12px;
  border: 1px solid #E0F0FF;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.month-reason {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #475569;
  }
  
  select {
    padding: 0.5rem;
    border: 1.5px solid #E2E8F0;
    border-radius: 6px;
    font-size: 0.85rem;
    background: white;
    cursor: pointer;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #008CFF;
      box-shadow: 0 0 0 2px rgba(0, 140, 255, 0.1);
    }
    
    &:hover {
      border-color: #CBD5E1;
    }
  }
}

.reason-summary {
  padding: 1rem;
  background: #F0F9FF;
  border-radius: 8px;
  border: 1px solid #BAE6FD;
  text-align: center;
  margin: 1rem 0;
  font-size: 0.9rem;
  
  strong {
    color: #008CFF;
    font-weight: 600;
  }
}

.zero-income-details {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #E2E8F0;
}

.person-income-block {
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px solid #F1F5F9;
  
  h4 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #1E293B;
    font-weight: 600;
  }
}

.reasons-selector {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #F1F5F9;
}

// Анимация появления
.months-grid {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Адаптивность для мобильных устройств
@media (max-width: 768px) {
  .months-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .month-reason {
    label {
      font-size: 0.75rem;
    }
    
    select {
      padding: 0.4rem;
      font-size: 0.8rem;
    }
  }
  
  .toggle-reasons-btn {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
  
  .person-income-block {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .months-grid {
    grid-template-columns: 1fr;
  }
  
  .reason-summary {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
}


@keyframes strongPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 140, 255, 0.4);
  }
  50% {
    // Увеличиваем интенсивность и размер свечения
    box-shadow: 0 0 0 15px rgba(0, 140, 255, 0.25);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 140, 255, 0);
  }
}

@keyframes doublePulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 140, 255, 0.4),
                0 0 0 0 rgba(0, 140, 255, 0.3);
  }
  50% {
    // Двойное свечение для большего эффекта
    box-shadow: 0 0 0 12px rgba(0, 140, 255, 0.2),
                0 0 0 20px rgba(0, 140, 255, 0.1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 140, 255, 0),
                0 0 0 0 rgba(0, 140, 255, 0);
  }
}

@keyframes pulseWithGlow {
  0%, 30% {
    box-shadow: 0 0 0 0 rgba(0, 140, 255, 0);
    transform: scale(1);
  }
  40% {
    // Легкое увеличение кнопки + свечение
    box-shadow: 0 0 0 8px rgba(0, 140, 255, 0.3);
    transform: scale(1.02);
  }
  55% {
    box-shadow: 0 0 0 15px rgba(0, 140, 255, 0.15);
    transform: scale(1.02);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(0, 140, 255, 0.1);
    transform: scale(1.01);
  }
  80%, 100% {
    box-shadow: 0 0 0 0 rgba(0, 140, 255, 0);
    transform: scale(1);
  }
}

.big-button.primary {
  transition: all 0.3s ease;
  position: relative;
  
  // Базовые стили для лучшей видимости
  background-color: #008CFF;
  border: none;
  color: white;
  
  // Постоянная тень для контраста
  box-shadow: 0 4px 15px rgba(0, 140, 255, 0.2);

  &.pulse-attention:not(:disabled) {
    animation: doublePulse 6s ease-in-out infinite;
    animation-delay: 2s;
    animation-fill-mode: both;
}
  
  // Эффект при наведении для интерактивности
  &:hover:not(:disabled) {
    background-color: #0073d9;
    box-shadow: 0 6px 20px rgba(0, 140, 255, 0.3);
    transform: translateY(-1px);
  }
}

// Альтернативный вариант с бесконечной анимацией для постоянного внимания
.big-button.primary.pulse-continuous:not(:disabled) {
  animation: strongPulse 2s ease-in-out infinite;
}

// Дополнительный класс для срочного внимания
.big-button.primary.pulse-urgent:not(:disabled) {
  animation: pulseWithGlow 1s ease-in-out 6;
}

// Стили для выбора региона с поиском
.select-wrapper {
  position: relative;
  width: 100%;
}

.search-trigger-wrapper {
  position: relative;
  width: 100%;
}

.region-search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #E8EAED;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #008CFF;
    cursor: text;
  }
  
  &::placeholder {
    color: #A2AAB5;
  }
}

.dropdown-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  color: #6F767E;
  font-size: 0.8rem;
  
  &.rotated {
    transform: translateY(-50%) rotate(180deg);
  }
  
  &:hover {
    color: #008CFF;
  }
}

.region-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #E8EAED;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.region-list {
  padding: 0.5rem 0;
}

.region-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: #F8FBFF;
    border-left-color: #008CFF;
  }
  
  &.selected {
    background-color: #F0F7FF;
    border-left-color: #008CFF;
    
    .region-name {
      color: #008CFF;
      font-weight: 600;
    }
  }
}

.region-name {
  font-size: 0.95rem;
  color: #1A1D1F;
}

.region-pm {
  font-size: 0.85rem;
  color: #6F767E;
  font-weight: 500;
}

.no-results {
  padding: 1.5rem;
  text-align: center;
  color: #6F767E;
  font-size: 0.9rem;
  background: #F8FAFC;
}

.selected-region-display {
  margin-top: 1rem;
  padding: 1rem;
  background: #F0F7FF;
  border-radius: 8px;
  border-left: 4px solid #008CFF;
  font-size: 0.95rem;
  
  strong {
    color: #008CFF;
  }
}

// Адаптивность для мобильных устройств
@media (max-width: 768px) {
  .region-search-input {
    padding: 0.875rem 2.5rem 0.875rem 0.875rem;
    font-size: 0.95rem;
  }
  
  .dropdown-arrow {
    right: 0.875rem;
  }
  
  .region-dropdown {
    max-height: 250px;
  }
  
  .region-option {
    padding: 0.625rem 0.875rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .region-name {
    font-size: 0.9rem;
  }
  
  .region-pm {
    font-size: 0.8rem;
    align-self: flex-end;
  }
  
  .selected-region-display {
    padding: 0.875rem;
    font-size: 0.9rem;
  }
}
</style>