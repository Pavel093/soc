import { defineStore } from 'pinia'
import { pmData } from '../utils/pmData'

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    region: null,
    hasSpouse: false,
    childrenCount: 0,       // только дети до 17 лет
    hasStudents: false,     // флаг наличия студентов
    studentsCount: 0,    
    income: {
      primary: null,
      reason: '',
      other: false,
    },
    property: {
      homes: 1,
      homeAreaOk: true,
      cars: 0,
      carSpecOk: true,
    },
    otherBenefits: false,
    currentStep: 1,
  }),

  getters: {
    totalSteps() {
      return 5
    },
    completedSteps() {
      let count = 0
      if (this.region) count++
      if (this.children.count > 0 || this.children.studentsCount > 0) count++
      if (this.income.primary !== null) count++
      if (this.property.homes >= 0) count++
      if (typeof this.otherBenefits === 'boolean') count++
      return count
    },
    pmValue() {
      return this.region ? pmData[this.region] || 0 : 0
    },
    familySize() {
      const parents = this.hasSpouse ? 2 : 1
      return parents + this.childrenCount + (this.hasStudents ? this.studentsCount : 0)
    },
    monthlyIncome() {
      const total =
        this.income.primary +
        (this.income.other ? 0 : 0) // можно расширить
      return total / 12 / this.familySize
    },
    percentOfPm() {
      return this.pmValue ? this.monthlyIncome / this.pmValue : 0
    },
    benefitLevel() {
      if (!this.isEligible) return 0
      if (this.percentOfPm < 0.5) return 1 // 75%
      if (this.percentOfPm < 1) return 2 // 50%
      return 3 // 100%
    },
    isEligible() {
      // Проверяем условия получения
      if (this.monthlyIncome > this.pmValue) return false
      if (this.property.homes > 1 && !this.property.homeAreaOk) return false
      if (this.property.cars > 1) return false
      if (
        this.property.cars === 1 &&
        !this.property.carSpecOk
      ) return false
      if (this.otherBenefits) return false
      return true
    },
    benefitAmount() {
      switch (this.benefitLevel) {
        case 1:
          return Math.round(this.pmValue * 0.75)
        case 2:
          return Math.round(this.pmValue * 0.5)
        case 3:
          return this.pmValue
        default:
          return 0
      }
    },
  },

  actions: {
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    // Удалены addChild и removeChild, так как они больше не нужны
  },
})