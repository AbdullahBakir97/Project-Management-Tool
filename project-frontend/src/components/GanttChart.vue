<template>
    <div ref="gantt" class="gantt-chart"></div>
  </template>
  
<script>
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import gantt from 'dhtmlx-gantt';

export default {
  name: 'GanttChart',
  data() {
    return {
      tasks: [],
    };
  },
  async created() {
    await this.fetchTasks();
    this.initializeGantt();
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await this.$store.dispatch('fetchTasks');
        this.tasks = response.map(task => ({
          id: task.id,
          text: task.title,
          start_date: task.start_date,
          end_date: task.end_date,
          duration: this.calculateDuration(task.start_date, task.end_date),
          progress: 0,
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    calculateDuration(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (end - start) / (1000 * 60 * 60 * 24);
    },
    initializeGantt() {
      gantt.config.date_format = "%Y-%m-%d";
      gantt.init(this.$refs.gantt);
      gantt.parse({ data: this.tasks });

      gantt.attachEvent('onAfterTaskDrag', (id, mode, e) => {
        const task = gantt.getTask(id);
        this.updateTask({
          id: task.id,
          start_date: task.start_date,
          end_date: task.end_date,
        });
      });
    },
    async updateTask(updatedTask) {
      try {
        await this.$store.dispatch('updateTask', updatedTask);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },
  },
};
</script>
  
  <style scoped>
  .gantt-chart {
    width: 100%;
    height: 500px;
  }
  </style>