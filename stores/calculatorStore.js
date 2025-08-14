import { defineStore } from 'pinia'

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    // Текущий шаг
    currentStep: 1,
    totalSteps: 5,
    
    // Шаг 1: Регион
    selectedRegion: '',
    pmValue: 0, // Прожиточный минимум на душу населения
    pmWorking: 0, // ПМ трудоспособного
    pmPensioner: 0, // ПМ пенсионера  
    pmChild: 0, // ПМ ребенка
    
    // Шаг 2: Состав семьи
    isPregnant: false,
    pregnancyWeeks: 0,
    childrenCount: 0,
    hasStudents: false,
    studentsCount: 0,
    hasSpouse: false,
    isSingleParent: false,
    
    // Шаг 3: Доходы
    income: {
      salary: 0,
      business: 0,
      pension: 0,
      alimony: 0,
      benefits: 0,
      rent: 0,
      scholarships: 0,
      other: 0
    },
    hasZeroIncome: false,
    zeroIncomeReasons: {
      childCare: false,
      disability: false,
      student: false,
      military: false,
      imprisonment: false,
      unemployment: false,
      longTreatment: false
    },
    
    // Шаг 4: Имущество
    property: {
      apartments: 0,
      houses: 0,
      landPlots: 0,
      nonResidentialProperty: 0,
      cars: 0,
      motorcycles: 0,
      deposits: 0
    },
    
    // Шаг 5: Другие пособия
    otherBenefits: false,
    
    // Результаты расчета
    calculationCompleted: false
  }),
  
  getters: {
    // Размер семьи
    familySize(state) {
      const adults = state.hasSpouse ? 2 : 1
      const students = state.hasStudents ? state.studentsCount : 0
      return adults + state.childrenCount + students
    },
    
    // Общий доход семьи
    totalIncome(state) {
      return Object.values(state.income).reduce((sum, value) => sum + (value || 0), 0)
    },
    
    // Среднедушевой доход
    averageIncome(state) {
      if (this.familySize === 0) return 0
      return this.totalIncome / this.familySize
    },
    
    // Проверка дохода
    incomeQualifies(state) {
      return this.averageIncome <= state.pmValue
    },
    
    // Проверка правила нулевого дохода
    hasValidReason(state) {
      return Object.values(state.zeroIncomeReasons).some(v => v)
    },
    
    zeroIncomeRuleOk(state) {
      // Если есть доход - правило соблюдено
      if (this.totalIncome > 0) return true
      // Если нет дохода, нужна уважительная причина
      return this.hasValidReason
    },
    
    // Проверка имущества
    propertyQualifies(state) {
      const isMultiChild = state.childrenCount >= 3
      
      // Квартиры: 1 на семью или по 24 кв.м на человека
      const apartmentLimit = 1
      if (state.property.apartments > apartmentLimit) {
        // Дополнительная проверка по площади нужна, но упрощаем
        return false
      }
      
      // Дома: 1 на семью или по 40 кв.м на человека
      const houseLimit = 1
      if (state.property.houses > houseLimit) {
        return false
      }
      
      // Машины: 1, или 2 для многодетных
      const carLimit = isMultiChild ? 2 : 1
      if (state.property.cars > carLimit) {
        return false
      }
      
      // Мотоциклы: 1, или 2 для многодетных
      const motorcycleLimit = isMultiChild ? 2 : 1
      if (state.property.motorcycles > motorcycleLimit) {
        return false
      }
      
      // Вклады: не более 1 ПМ * 12 (упрощенно)
      const depositLimit = state.pmValue * 12
      if (state.property.deposits > depositLimit) {
        return false
      }
      
      // Земельные участки: до 0,25 га в городе, до 1 га в селе
      const landLimit = 1 // Упрощаем - до 1 га
      if (state.property.landPlots > landLimit) {
        return false
      }
      
      // Нежилая недвижимость: 1 объект
      if (state.property.nonResidentialProperty > 1) {
        return false
      }
      
      return true
    },
    
    // Итоговое право на пособие
    isEligible(state) {
      return this.incomeQualifies && 
             this.propertyQualifies && 
             this.zeroIncomeRuleOk &&
             !state.otherBenefits
    },
    
    // Размер пособия (процент от ПМ)
    benefitPercentage(state) {
      if (!this.isEligible) return 0
      
      const avgIncome = this.averageIncome
      const pm = state.pmValue
      
      // Базовый размер - 50%
      let percentage = 50
      
      // Проверка с 50%
      const with50 = avgIncome + (pm * 0.5)
      if (with50 < pm) {
        percentage = 75
        
        // Проверка с 75%
        const with75 = avgIncome + (pm * 0.75)
        if (with75 < pm) {
          percentage = 100
        }
      }
      
      return percentage
    },
    
    // Сумма пособия
    totalBenefitAmount(state) {
      if (!this.isEligible) return 0
      
      const percentage = this.benefitPercentage / 100
      let total = 0
      
      // Пособие для беременных (если нет детей)
      if (state.isPregnant && state.childrenCount === 0) {
        total += state.pmWorking * percentage
      }
      
      // Пособие на детей
      if (state.childrenCount > 0) {
        total += state.pmChild * percentage * state.childrenCount
      }
      
      return Math.round(total)
    },
    
    // Прогресс заполнения
    completionProgress(state) {
      let completed = 0
      
      // Шаг 1
      if (state.selectedRegion) completed += 20
      
      // Шаг 2  
      if (state.childrenCount > 0 || state.isPregnant) completed += 20
      
      // Шаг 3
      if (this.totalIncome > 0 || this.hasValidReason) completed += 20
      
      // Шаг 4
      if (Object.values(state.property).some(v => v !== null)) completed += 20
      
      // Шаг 5
      if (state.currentStep >= 5) completed += 20
      
      return completed
    }
  },
  
  actions: {
    // Навигация по шагам
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
      } else {
        this.calculateResult()
      }
    },
    
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    
    goToStep(step) {
      if (step >= 1 && step <= this.totalSteps) {
        this.currentStep = step
      }
    },
    
    // Установка региона
    setRegion(regionData) {
      this.selectedRegion = regionData.name
      this.pmValue = regionData.pmValue
      this.pmWorking = regionData.pmWorking
      this.pmPensioner = regionData.pmPensioner
      this.pmChild = regionData.pmChild
    },
    
    // Обновление дохода
    updateIncome(type, value) {
      if (this.income.hasOwnProperty(type)) {
        this.income[type] = parseFloat(value) || 0
      }
    },
    
    // Обновление имущества
    updateProperty(type, value) {
      if (this.property.hasOwnProperty(type)) {
        this.property[type] = parseFloat(value) || 0
      }
    },
    
    // Расчет результата
    calculateResult() {
      this.calculationCompleted = true
      this.currentStep = 6 // Переход к результатам
    },
    
    // Сброс калькулятора
    resetCalculation() {
      this.currentStep = 1
      this.selectedRegion = ''
      this.pmValue = 0
      this.pmWorking = 0
      this.pmPensioner = 0
      this.pmChild = 0
      
      this.isPregnant = false
      this.pregnancyWeeks = 0
      this.childrenCount = 0
      this.hasStudents = false
      this.studentsCount = 0
      this.hasSpouse = false
      this.isSingleParent = false
      
      this.income = {
        salary: 0,
        business: 0,
        pension: 0,
        alimony: 0,
        benefits: 0,
        rent: 0,
        scholarships: 0,
        other: 0
      }
      
      this.hasZeroIncome = false
      this.zeroIncomeReasons = {
        childCare: false,
        disability: false,
        student: false,
        military: false,
        imprisonment: false,
        unemployment: false,
        longTreatment: false
      }
      
      this.property = {
        apartments: 0,
        houses: 0,
        landPlots: 0,
        nonResidentialProperty: 0,
        cars: 0,
        motorcycles: 0,
        deposits: 0
      }
      
      this.otherBenefits = false
      this.calculationCompleted = false
    },
    
    // Сохранение в localStorage
    saveProgress() {
      const data = {
        currentStep: this.currentStep,
        state: this.$state
      }
      localStorage.setItem('unifiedBenefitProgress', JSON.stringify(data))
    },
    
    // Загрузка из localStorage
    loadProgress() {
      const saved = localStorage.getItem('unifiedBenefitProgress')
      if (saved) {
        const data = JSON.parse(saved)
        this.$patch(data.state)
        this.currentStep = data.currentStep
        return true
      }
      return false
    }
  }
})