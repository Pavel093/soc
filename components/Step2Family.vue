<template>
  <div>
    <h2>2. Состав семьи</h2>
    <label>
      <input type="checkbox" v-model="hasSpouse" />
      Есть супруг(а)
    </label>

    <h3>Дети:</h3>
    <div v-for="(child, i) in children" :key="i" class="child">
      <input type="number" v-model.number="child.age" min="0" max="23" />
      <label>
        <input type="checkbox" v-model="child.student" />
        Студент очного отделения (до 23 лет)
      </label>
      <button @click="removeChild(i)">Удалить</button>
    </div>
    <button @click="addChild">Добавить ребенка</button>
  </div>
</template>

<script setup>
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()
const { hasSpouse, children } = storeToRefs(store)
const { addChild, removeChild } = store
</script>