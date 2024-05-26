<template>
    <div class="task-board">
      <h1>Task Board</h1>
      <form @submit.prevent="createTask">
        <input v-model="newTask.title" placeholder="Title" required />
        <textarea v-model="newTask.description" placeholder="Description"></textarea>
        <select v-model="newTask.status">
          <option v-for="status in statuses" :key="status" :value="status">{{ statusLabels[status] }}</option>
        </select>
        <input type="date" v-model="newTask.due_date" />
        <input v-model="newTask.assigned_to" placeholder="Assign to user ID" />
        <button type="submit">Add Task</button>
      </form>
      <div class="columns">
        <div class="column" v-for="status in statuses" :key="status">
          <h2>{{ statusLabels[status] }}</h2>
          <draggable v-model="tasksByStatus(status)" @end="onEnd">
            <TaskCard
              v-for="task in tasksByStatus(status)"
              :key="task.id"
              :task="task"
              @edit="editTask"
              @delete="deleteTask"
            />
          </draggable>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  import draggable from 'vuedraggable';
  import TaskCard from './TaskCard.vue';
  
  export default {
    components: {
      draggable,
      TaskCard,
    },
    data() {
      return {
        newTask: {
          title: '',
          description: '',
          status: 'TODO',
          due_date: null,
          priority: 1,
        },
        statuses: ['TODO', 'IN_PROGRESS', 'DONE'],
        statusLabels: {
          'TODO': 'To Do',
          'IN_PROGRESS': 'In Progress',
          'DONE': 'Done',
        },
      };
    },
    computed: {
      ...mapGetters(['tasksByStatus']),
    },
    created() {
      this.fetchTasks();
    },
    methods: {
      ...mapActions(['fetchTasks', 'createTask', 'updateTask']),
      onEnd(evt) {
        const movedTask = evt.item.__vue__.$data.task;
        movedTask.status = evt.to.dataset.status;
        this.updateTask(movedTask);
      },
      editTask(task) {
        this.newTask = { ...task };
      },
      async deleteTask(taskId) {
        try {
          await api.delete(`tasks/${taskId}/`);
          this.fetchTasks();
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .task-board {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  form {
    margin-bottom: 20px;
  }
  input, textarea, select {
    display: block;
    margin-bottom: 10px;
  }
  .columns {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .column {
    flex: 1;
    margin: 0 10px;
  }
  .task {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  </style>