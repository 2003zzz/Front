<template>
  <v-app class="App">
    <v-navigation-drawer theme="dark" permanent class="blurred-drawer" app>
      <v-list>
        <v-list-item subtitle="alex@yandex.ru" title="Александр Очнев" prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg">
          <template v-slot:append>
            <v-btn icon="mdi-menu-down" size="small" variant="text"></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item-group>
          <v-list-item prepend-icon="mdi-calendar" title="Моя компания" />
          <v-list-item
            prepend-icon="mdi-projector-screen"
            title="Текущие проекты"
          />
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-card class="kanban-container">
        <v-tabs v-model="tab" color="white" class="tabs">
          <v-tab v-for="tab_ in tabs" :key="tab_.id" :value="tab_.value"
            >{{ tab_.name }}
            <v-icon class="ma-1">{{ tab_.icon }}</v-icon>
          </v-tab>
          <v-tab :value="create">
            <v-btn variant="outlined" color="white">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item
            v-for="tab_ in tabs"
            :key="tab_.id"
            :value="tab_.value"
          >
            <v-container fluid class="mt-2 ma-2">
              <KanbanBoard></KanbanBoard>
            </v-container>
          </v-tabs-window-item>
          <v-tabs-window-item>
            <v-container fluid class="mt-2 ma-2">
              <new-project></new-project>
            </v-container>
          </v-tabs-window-item>
        </v-tabs-window>
        <!-- <v-btn @click="chatVisible = !chatVisible" class="chat-btn" variant="text" style="background: transparent; color: aliceblue;">
          <v-icon>mdi-chat</v-icon>
        </v-btn> -->
      </v-card>
    </v-main>
    <!-- <v-navigation-drawer theme="light" permanent class="blurred-drawer" app location="right">
      <v-list dense nav>
        <chat class="chat-component"></chat>
      </v-list>
    </v-navigation-drawer> -->
  </v-app>
</template>

<script>
import KanbanBoard from "../components/KanbanBoard.vue";
import NewProject from "./NewProject.vue";
export default {
  components: {
    NewProject,
    KanbanBoard,
  },

  data: () => ({
    tab: null,
    chatVisible: false,
    tabs: [
      {
        // получить с бэка
        id: 1,
        value: "one",
        name: "Разработка",
        icon: "mdi-xml",
      },
    ],
  }),
  methods: {},
};
</script>

<style scoped>
.App {
  background-image: url("../assets/fon2.jpg");
  background-size: cover;
}
.v-tabs-window {
  min-height: 500px;
}
.blurred-drawer {
  background-color: rgba(38, 58, 63, 0.6);
  backdrop-filter: blur(10px);
}
.tabs {
  backdrop-filter: blur(5px);
  background-color: rgba(38, 58, 63, 0.6);
}
.kanban-container {
  background-image: url("../assets/fon2.jpg");
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  background-color: rgb(188, 199, 204);
}
.v-container {
  padding: 0;
  max-width: 1300px;
  left: 0;
}
.chat-component {
  position: fixed;
  right: 0;
  bottom: 0;
  height: 100%;
}

.chat-btn {
  position: fixed;
  right: 0;
  z-index: 1001; 
}
</style>
