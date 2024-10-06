<script>
export default {
  data: () => ({
    messages: [
      {
        from: "You",
        message: `Sure, I'll see you later.`,
        time: "10:42am",
        color: "deep-purple-lighten-1",
      },
      {
        from: "John Doe",
        message: "Yeah, sure. Does 1:00pm work?",
        time: "10:37am",
        color: "green",
      },
      {
        from: "You",
        message: "Did you still want to grab lunch today?",
        time: "9:47am",
        color: "deep-purple-lighten-1",
      },
    ],
  }),
  methods: {
    Send() {
      console.log("Send");
    },
  },
};
</script>
<template>
  <v-card class="mx-auto" width="400">
    <!-- <v-toolbar color="transparent">
      <template v-slot:prepend>
        <v-btn icon="$menu"></v-btn>
      </template>
      <v-toolbar-title class="text-h6" text="Messages"></v-toolbar-title>
      <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-toolbar> -->

    <v-card-text>
      <div class="font-weight-bold ms-1 mb-2">Чат</div>
      <v-timeline>
        <v-timeline-item
          v-for="message in messages"
          :key="message.time"
          :dot-color="message.color"
          size="x-small"
        >
          <div class="mb-1">
            <div class="font-weight-normal">
              <strong>{{ message.from }}</strong> {{ message.time }}
            </div>
            <div class="message text-caption">{{ message.message }}</div>
          </div>
        </v-timeline-item>
      </v-timeline>
      <div class="send-message">
        <v-text-field
          rounded="xl"
          placeholder="Сообщение"
          variant="outlined"
          append-inner-icon="mdi-send"
          @click:append-inner="Send"
        ></v-text-field>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.send-message {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5px;
}
.v-text-field {
  border-radius: 20px;
}
.v-timeline::before {
  display: none; /* Скрываем центральную линию */
}
.mdi-send {
}
.message {
  border-radius: 10px;
  background: rgb(234, 231, 231);
  padding: 5px;
  box-sizing: border-box;
}
</style>
