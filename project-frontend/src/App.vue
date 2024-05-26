<template>
  <div id="app">
    <TaskBoard />
  </div>
</template>

<script>
import TaskBoard from './components/TaskBoard.vue';

export default {
  name: 'App',
  components: {
    TaskBoard,
  },
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
