<template>
  <div class="family-step">
    <h2>Состав семьи</h2>
    
    <div class="children-section">
      <div class="input-group">
        <label>Количество детей (до 17 лет):</label>
        <div class="input-numbers">
           <button class="minus" @click="decrementChildren" :disabled="childrenCount <= 0">
              <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4229 0.258179H1.61236C0.916792 0.258179 0.352936 0.822035 0.352936 1.5176C0.352936 2.21316 0.916792 2.77702 1.61236 2.77702H13.4229C14.1185 2.77702 14.6823 2.21316 14.6823 1.5176C14.6823 0.822035 14.1185 0.258179 13.4229 0.258179Z" fill="white"/>
              </svg>
            </button>
            <input
              type="number"
              v-model.number="childrenCount"
              min="0"
              max="20"
              class="number-input"
              @input="validateChildrenInput"
            />
            <button class="plus" @click="incrementChildren" :disabled="childrenCount >= 20">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4229 6.25819H8.77706V1.61233C8.77706 0.916762 8.21321 0.352905 7.51764 0.352905C6.82208 0.352905 6.25822 0.916762 6.25822 1.61233V6.25819H1.61236C0.916793 6.25819 0.352936 6.82205 0.352936 7.51761C0.352936 8.21318 0.916793 8.77703 1.61236 8.77703H6.25822V13.4229C6.25822 14.1185 6.82208 14.6823 7.51764 14.6823C8.21321 14.6823 8.77706 14.1185 8.77706 13.4229V8.77703H13.4229C14.1185 8.77703 14.6823 8.21318 14.6823 7.51761C14.6823 6.82205 14.1185 6.25819 13.4229 6.25819Z" fill="white"/>
              </svg>
            </button>
        </div>
      </div>
    </div>

    <div class="students-section">
      <div class="input-group">
        <label class="custom-checkbox">
          <input type="checkbox" v-model="hasStudents" />
          <span class="checkmark"></span>
          Есть студент(ы) очного отделения (до 23 лет)
        </label>
      </div>

      <div class="input-group two" v-if="hasStudents">
        <label>Количество студентов:</label>
        <div class="input-numbers">
          <button class="minus" @click="decrementStudents" :disabled="studentsCount <= 0">
            <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.4229 0.258179H1.61236C0.916792 0.258179 0.352936 0.822035 0.352936 1.5176C0.352936 2.21316 0.916792 2.77702 1.61236 2.77702H13.4229C14.1185 2.77702 14.6823 2.21316 14.6823 1.5176C14.6823 0.822035 14.1185 0.258179 13.4229 0.258179Z" fill="white"/>
            </svg>
          </button>
          <input
            type="number"
            v-model.number="studentsCount"
            min="0"
            max="20"
            class="number-input"
            @input="validateStudentsInput"
          />
          <button class="plus" @click="incrementStudents" :disabled="studentsCount >= 20">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.4229 6.25819H8.77706V1.61233C8.77706 0.916762 8.21321 0.352905 7.51764 0.352905C6.82208 0.352905 6.25822 0.916762 6.25822 1.61233V6.25819H1.61236C0.916793 6.25819 0.352936 6.82205 0.352936 7.51761C0.352936 8.21318 0.916793 8.77703 1.61236 8.77703H6.25822V13.4229C6.25822 14.1185 6.82208 14.6823 7.51764 14.6823C8.21321 14.6823 8.77706 14.1185 8.77706 13.4229V8.77703H13.4229C14.1185 8.77703 14.6823 8.21318 14.6823 7.51761C14.6823 6.82205 14.1185 6.25819 13.4229 6.25819Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="spouse-section">
      <label class="custom-checkbox"> 
        <input type="checkbox" v-model="hasSpouse" />
        <span class="checkmark"></span>
        Есть супруг(а)
      </label>
    </div>

  </div>
</template>

<script setup>
import { useCalculatorStore } from '../stores/calculatorStore'
import { storeToRefs } from 'pinia'

const store = useCalculatorStore()
const { 
  hasSpouse, 
  childrenCount, 
  hasStudents, 
  studentsCount 
} = storeToRefs(store)

// Функции для управления количеством детей
const incrementChildren = () => {
  if (childrenCount.value < 20) {
    childrenCount.value++
  }
}

const decrementChildren = () => {
  if (childrenCount.value > 0) {
    childrenCount.value--
  }
}

const validateChildrenInput = () => {
  if (childrenCount.value < 0) {
    childrenCount.value = 0
  } else if (childrenCount.value > 20) {
    childrenCount.value = 20
  }
}

// Функции для управления количеством студентов
const incrementStudents = () => {
  if (studentsCount.value < 20) {
    studentsCount.value++
  }
}

const decrementStudents = () => {
  if (studentsCount.value > 0) {
    studentsCount.value--
  }
}

const validateStudentsInput = () => {
  if (studentsCount.value < 0) {
    studentsCount.value = 0
  } else if (studentsCount.value > 20) {
    studentsCount.value = 20
  }
}
</script>

<style scoped lang="scss">
.family-step{
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  margin-top: 24px;
  h2{
    position: absolute;
    top: 15px;
    left: calc(15px + 69px + 15px);
    font-weight: 300;
    font-size: 25px;
    max-width: 90%;
    letter-spacing: 1.02px;
    line-height: 0.9;
  }
  .spouse-section{
    width: 100%;
    label{
      display: flex;
      align-items: center;
      min-height: 22px;
      padding-left: 30px;
    }
  }
  .children-section, .students-section {
    width: 100%;
    .input-group{
      display: flex;
      flex-wrap: nowrap;
      gap: 6px;
      align-items: center;
      .input-numbers{
        display: flex;
        align-items: center;
        gap: 6px;
        input[type="number"] {
          width: 60px;
          height: 38px;
          border: 1px solid #C4C2FF;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 17px;
          padding-left: 0px; 
          -moz-appearance: textfield; 
          appearance: textfield; 
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .minus, .plus{
          width: 32px;
          height: 32px;
          background-color: #008CFF;
          display: flex;
          border: none;
          border-radius: 7px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  .students-section{
    display: flex;
    flex-wrap: wrap;
    height: max-content;
    label{
      display: flex;
      align-items: center;
      min-height: 22px;
      padding-left: 30px;
    }
    .two{
      margin-top:18px;
    }
  }
}
</style>