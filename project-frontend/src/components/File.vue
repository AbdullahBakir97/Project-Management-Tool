<template>
    <div class="file-upload">
      <h3>Upload Files</h3>
      <input type="file" @change="handleFileUpload">
      <button @click="submitFile">Upload</button>
      <ul>
        <li v-for="file in files" :key="file.id">{{ file.file }}</li>
      </ul>
    </div>
  </template>
  
  <script>
    export default {
        props: ['taskId'],
        data() {
            return {
                selectedFile: null,
                files: []
            };
        },
        methods: {
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0];
        },
        async submitFile() {
            let formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('task', this.taskId);
            await this.$store.dispatch('uploadFile', formData);
            this.fetchFiles();
        },
        async fetchFiles() {
            this.files = await this.$store.dispatch('fetchFiles', this.taskId);
        }
        },
        async created() {
            this.fetchFiles().catch(error => console.error('Failed to fetch files:', error));
        }
    };
  </script>
  