<template>
  <div :class="['alert', `alert-${type}`]">
    <div class="alert-icon">{{ icon }}</div>
    <div class="alert-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'info' | 'warning' | 'success' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info'
})

const icon = computed(() => {
  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    danger: '❌'
  }
  return icons[props.type]
})
</script>

<style scoped lang="scss">
.alert {
  display: flex;
  gap: 15px;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 25px 0;
  align-items: flex-start;
}

.alert-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
  
  :deep(p:last-child) {
    margin-bottom: 0;
  }
}

.alert-info {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  color: #1976d2;
}

.alert-warning {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  color: #f57c00;
}

.alert-success {
  background: #e8f5e9;
  border-left: 4px solid #4caf50;
  color: #388e3c;
}

.alert-danger {
  background: #ffebee;
  border-left: 4px solid #f44336;
  color: #d32f2f;
}
</style>