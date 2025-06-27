<template>
  <div>
    <h2>5. Получает ли семья другие пособия?</h2>
    <label><input type="radio" v-model="otherBenefits" :value="true" /> Да</label>
    <label><input type="radio" v-model="otherBenefits" :value="false" /> Нет</label>
  </div>
</template>

<script setup>
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()
const otherBenefits = computed({
  get: () => store.otherBenefits,
  set: val => store.otherBenefits = val
})
</script>