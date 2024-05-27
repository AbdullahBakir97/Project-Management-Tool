<template>
    <div class="calendar-view">
      <FullCalendar :events="events" @dateClick="handleDateClick" />
    </div>
  </template>
  
  <script>
  import FullCalendar from '@fullcalendar/vue';
  import dayGridPlugin from '@fullcalendar/daygrid';
  
  export default {
    components: { FullCalendar },
    data() {
      return {
        events: []
      };
    },
    methods: {
      handleDateClick(info) {
        console.log('Date clicked:', info.dateStr);
      },
      async fetchEvents() {
        this.events = await this.$store.dispatch('fetchEvents');
      }
    },
    async created() {
      this.fetchEvents();
    }
  };
  </script>
  
  <style>
  .calendar-view {
    max-width: 900px;
    margin: 0 auto;
  }
  </style>
  