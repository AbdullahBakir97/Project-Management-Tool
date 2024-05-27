<template>
    <div>
      <div class="file-upload">
        <h3>Upload Files</h3>
        <input type="file" @change="handleFileUpload">
        <button @click="submitFile">Upload</button>
      </div>
      <FileList :taskId="taskId" />
    </div>
  </template>
  
  <script>
  import FileList from './FileList.vue';
  
  export default {
    components: {
      FileList
    },
    props: {
      taskId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        selectedFile: null
      };
    },
    methods: {
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
      },
      async submitFile() {
        if (!this.selectedFile) {
          console.error('No file selected.');
          return;
        }
        let formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('task', this.taskId);
        try {
          await this.$store.dispatch('uploadFile', formData);
          console.log('File uploaded successfully.');
          // Optionally, you can emit an event to notify the parent component about the file upload.
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .file-upload {
    margin-bottom: 20px;
  }
  </style>
  