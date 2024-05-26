<template>
  <div class="task-card">
    <p>{{ task.title }}</p>
    <p>{{ task.description }}</p>
    <p>Due: {{ task.due_date }}</p>
    <p>Priority: {{ task.priority }}</p>
    <button @click="$emit('edit', task)">Edit</button>
    <button @click="$emit('delete', task.id)">Delete</button>
  </div>
</template>

<script>
export default {
  props: ['task'],
};
</script>

<style scoped>
.task-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>