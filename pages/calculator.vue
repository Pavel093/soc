<script setup>
import { computed, ref } from 'vue'
import { useCalculatorStore } from '~/stores/calculatorStore'
import Step1Region from '~/components/Step1Region.vue'
import Step2Family from '~/components/Step2Family.vue'
import Step3Income from '~/components/Step3Income.vue'
import Step4Property from '~/components/Step4Property.vue'
import Step5Benefits from '~/components/Step5Benefits.vue'

const store = useCalculatorStore()
const showingResult = ref(false)

const currentComponent = computed(() => {
  switch (store.currentStep) {
    case 1:
      return Step1Region
    case 2:
      return Step2Family
    case 3:
      return Step3Income
    case 4:
      return Step4Property
    case 5:
      return Step5Benefits
    default:
      return Step1Region
  }
})

function prevStep() {
  store.prevStep()
}

function nextStep() {
  store.nextStep()
}

function showResult() {
  showingResult.value = true
}

const { currentStep, totalSteps, completedSteps, isEligible, benefitAmount } = storeToRefs(store)
</script>

<template>
  <div class="container">
    <div class="header base-bg-color">
      <h1 class="dark-text">
        Рассчитайте размер единого пособия онлайн — быстро, бесплатно и без регистрации
      </h1>
    </div>
    <div class="content base-bg-color-two">
      <div class="progress base-bg-color">
        <div class="progress-numbers">
          <p class="one">{{ currentStep }}</p>
          <p class="dop">/</p>
          <p class="two">{{ totalSteps }}</p>
        </div>
        <p class="more">вопрос {{ currentStep }} из {{ totalSteps }}</p>
      </div>

      <component :is="currentComponent" />
    </div>

    <div class="controls base-bg-color-two">
      <button class="big-button" @click="prevStep" :disabled="currentStep === 1">назад</button>
      <button class="big-button" v-if="currentStep < totalSteps" @click="nextStep">далее</button>
      <button v-else @click="showResult">рассчитать</button>
    </div>

    <div v-if="showingResult" class="result">
      <h2>Результат:</h2>
      <p v-if="!isEligible">Вы не соответствуете условиям.</p>
      <p v-else>
        Размер пособия: <strong>{{ benefitAmount }} руб./мес</strong>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  height: 100dvh; 
  display: flex;
  flex-direction: column; 
  box-sizing: border-box; 
  @media(max-width: 768px) {
    padding: 10px;
  }
  .progress {
    margin-bottom: 0px;
  }
  @media(max-width: 768px) {
    padding: 15px;
  }
  .header {
    width: 100%;
    height: max-content;
    box-sizing: border-box;
    padding: 15px;
    border-radius: 14.5px;
    flex-shrink: 0; 
    margin-bottom: 20px;
    h1 {
      font-size: 20px;
      margin: 0;
    }
    @media(max-width: 768px) {
      padding: 15px;
    }
  }
  
  .content {
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
    border-radius: 14.5px;
    margin-bottom: 20px;
    flex-grow: 1; 
    overflow-y: auto; 
    position: relative;
    .progress {
      .progress-numbers {
        display: flex;
        gap: 2.5px;
        background-color: white;
        width: max-content;
        justify-content: center;
        align-items: center;
        height: 47px; 
        width: 69px;
        border-radius: 15px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: 5px;
          right: 5px;
          bottom: 5px;
          left: 5px;
          border: 1px solid #9CE1FF; 
          border-radius: 10px; 
          pointer-events: none;
        }
        p {
          font-size: 23px;
          margin: 0;
          padding: 0;
          line-height: 1; 
        }

        .one {
          color: #00B93E;
        }
      }
      .more{
        margin-top: 5px;
        font-size: 15px;
        color: #A2AAB5;
      }
    }
    @media(max-width: 768px) {
      padding: 15px;
    }
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    padding: 7px;
    box-sizing: border-box;
    border-radius: 14.5px;
    width: 100%;
    height: max-content;
    flex-shrink: 0; /* Запрещаем сжатие */
    @media(max-width: 768px) {
      padding: 15px;
    }
  }
  
  .result {
    margin-top: 30px;
    font-size: 18px;
  }
}
</style>