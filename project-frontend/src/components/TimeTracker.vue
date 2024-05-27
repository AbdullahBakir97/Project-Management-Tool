<template>
  <div class="time-tracker">
    <h2>Time Tracker</h2>
    <div v-if="task">
      <p>Task: {{ task.title }}</p>
      <button @click="startTimer" :disabled="timer">Start Timer</button>
      <button @click="stopTimer" :disabled="!timer">Stop Timer</button>
      <ul>
        <li v-for="entry in timeEntries" :key="entry.id">
          {{ entry.start_time }} - {{ entry.end_time }} ({{ entry.duration }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['taskId'],
  data() {
    return {
      timer: null,
      startTime: null,
    };
  },
  computed: {
    task() {
      return this.$store.state.tasks.find(task => task.id === this.taskId);
    },
    timeEntries() {
      return this.$store.getters.timeEntriesByTask(this.taskId);
    },
  },
  methods: {
    startTimer() {
      this.startTime = new Date();
      this.timer = setInterval(() => {
        console.log('Timer running');
      }, 1000);
    },
    async stopTimer() {
      clearInterval(this.timer);
      const endTime = new Date();
      await this.$store.dispatch('createTimeEntry', {
        task: this.taskId,
        user: 1, // Replace with the logged-in user ID
        start_time: this.startTime.toISOString(),
        end_time: endTime.toISOString(),
      });
      this.startTime = null;
      this.timer = null;
    },
  },
  async created() {
    await this.$store.dispatch('fetchTimeEntries');
  },
};
</script>

<style scoped>
.time-tracker {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 20px;
}
</style>