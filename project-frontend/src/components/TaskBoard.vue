<template>
    <div class="task-board">
      <h1>Task Board</h1>
      <form @submit.prevent="createTask">
        <input v-model="newTask.title" placeholder="Title" required />
        <textarea v-model="newTask.description" placeholder="Description"></textarea>
        <button type="submit">Add Task</button>
      </form>
      <div class="columns">
        <div class="column" v-for="status in statuses" :key="status">
          <h2>{{ status }}</h2>
          <draggable v-model="filteredTasks(status)" @end="onEnd">
            <div class="task" v-for="task in filteredTasks(status)" :key="task.id">
              <p>{{ task.title }}</p>
              <p>{{ task.description }}</p>
            </div>
          </draggable>
        </div>
      </div>
</div>
</template>
  
  <script>
  import api from '../services/api';
  import draggable from 'vuedraggable';
  
  export default {
    components: {
      draggable,
    },
    data() {
      return {
        tasks: [],
        newTask: {
          title: '',
          description: '',
          status: 'TODO',
        },
        statuses: ['TODO', 'IN_PROGRESS', 'DONE'],
      };
    },
    created() {
      this.fetchTasks();
    },
    methods: {
      async fetchTasks() {
        try {
          const response = await api.get('tasks/');
          this.tasks = response.data;
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      },
      filteredTasks(status) {
        return this.tasks.filter(task => task.status === status);
      },
      async createTask() {
        try {
          const response = await api.post('tasks/', this.newTask);
          this.tasks.push(response.data);
          this.newTask.title = '';
          this.newTask.description = '';
        } catch (error) {
          console.error('Error creating task:', error);
        }
      },
      async onEnd(evt) {
        const movedTask = this.tasks[evt.oldIndex];
        movedTask.status = evt.to.dataset.status;
        try {
          await api.put(`tasks/${movedTask.id}/`, movedTask);
          this.fetchTasks();
        } catch (error) {
          console.error('Error updating task status:', error);
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
  input, textarea {
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
  