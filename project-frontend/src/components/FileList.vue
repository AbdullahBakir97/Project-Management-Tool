<template>
    <div class="file-list">
      <h3>Uploaded Files</h3>
      <ul>
        <li v-for="file in files" :key="file.id">{{ file.name }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      taskId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        files: []
      };
    },
    methods: {
      async fetchFiles() {
        try {
          this.files = await this.$store.dispatch('fetchFiles', this.taskId);
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      }
    },
    created() {
      this.fetchFiles();
    }
  };
  </script>
  
  <style scoped>
  .file-list {
    margin-top: 20px;
  }
  </style>
  