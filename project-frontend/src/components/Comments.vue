<template>
  <div class="comments">
    <h2>Comments</h2>
    <div v-if="task">
      <textarea v-model="newComment.content" placeholder="Add a comment..."></textarea>
      <button @click="addComment">Post Comment</button>
      <ul>
        <li v-for="comment in comments" :key="comment.id">
          {{comment.content }} - {{ comment.user.username }}


   <script>
   export default {
     props: ['taskId'],
     data() {
       return {
         newComment: {
           content: '',
           task: this.taskId,
           user: 1, // Replace with the logged-in user ID
         },
       };
     },
     computed: {
       task() {
         return this.$store.state.tasks.find(task => task.id === this.taskId);
       },
       comments() {
         return this.$store.getters.commentsByTask(this.taskId);
       },
     },
     methods: {
       async addComment() {
         try {
           await this.$store.dispatch('createComment', this.newComment);
           this.newComment.content = '';
         } catch (error) {
           console.error('Error creating comment:', error);
         }
       },
     },
     async created() {
       await this.$store.dispatch('fetchComments');
     },
   };
   </script>

   <style scoped>
   .comments {
     border: 1px solid #ccc;
     padding: 10px;
     margin-top: 20px;
   }
   </style>
