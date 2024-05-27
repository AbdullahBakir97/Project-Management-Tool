<template>
    <div class="reports">
      <h3>Task Status Report</h3>
      <PieChart :data="taskStatusData" />
      <h3>Project Time Report</h3>
      <BarChart :data="projectTimeData" />
    </div>
  </template>
  
  <script>
  import { Pie, Bar } from 'vue-chartjs';
  import { mapActions, mapState } from 'vuex';
  
  export default {
    components: { PieChart: Pie, BarChart: Bar },
    computed: {
      ...mapState(['taskStatusData', 'projectTimeData']),
    },
    created() {
      this.fetchTaskStatusReport();
      this.fetchProjectTimeReport(this.selectedProjectId);
    },
    methods: {
      ...mapActions(['fetchTaskStatusReport', 'fetchProjectTimeReport']),
    },
  };
  </script>
  