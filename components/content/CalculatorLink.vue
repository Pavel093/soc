<template>
  <div class="calculator-link">
    <div class="calculator-icon">🧮</div>
    <div class="calculator-info">
      <h4>{{ title }}</h4>
      <p>{{ description }}</p>
      <NuxtLink :to="to" class="calculator-button">
        Перейти к калькулятору →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  to: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.calculator-link {
  display: flex;
  gap: 20px;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin: 30px 0;
  color: white;
  align-items: center;
}

.calculator-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.calculator-info {
  flex: 1;
  
  h4 {
    font-size: 1.375rem;
    margin-bottom: 8px;
  }
  
  p {
    opacity: 0.9;
    margin-bottom: 15px;
  }
}

.calculator-button {
  display: inline-block;
  padding: 10px 20px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
}

@media (max-width: 768px) {
  .calculator-link {
    flex-direction: column;
    text-align: center;
  }
}
</style>