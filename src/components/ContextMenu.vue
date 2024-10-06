<script>
const baseUrl = "http://127.0.0.1:8000";
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  props: {
    currentTask: Object,
    tableName: String,
  },
  emits: ["updateListTask"],
  data: () => ({
    items: [
      { id: 1, title: "Удалить задачу", icon: "mdi-delete" },
      { id: 2, title: "Редактировать задачу", icon: "mdi-pencil" },
    ],
    activatorProps: false,
    loading: false,
    currentTaskText: '',
    currentStateTask: null,
    itemsState: [],
  }),
  methods: {
    action(item) {
      const actions = {
        1: "deleteTask",
        2: "replaceTask",
      };
      return actions[item.id];
    },
    async deleteTask() {
      await axios.post(`${baseUrl}/deleteTask`, {
        id: this.currentTask.id,
        table: this.tableName,
        _method: "DELETE",
      });
      this.$emit("updateListTask", this.tableName);

    },
   replaceTask() {
      this.loading = !this.loading;
      this.activatorProps = !this.activatorProps;
    },
    async updateTask() {
      this.loading = !this.loading; 
      await axios.put(`${baseUrl}/updateTask`, {
        id: this.currentTask.id,
        title: this.currentTaskText,
        table: this.tableName,
        id_state: this.currentStateTask,
      })
      this.$emit("updateListTask", this.tableName);
      this.activatorProps = false;
    },
    async getState() {
      const response = await axios.get(`${baseUrl}/getState`);
      this.itemsState = response.data;
    },
    replaceState(id) {
      this.currentStateTask = id;
    }
  },
  watch: {
    loading(val) {
      if (!val) return;
      setTimeout(() => (this.loading = false), 500);
    },
    activatorProps(val) {
      if (val) {
        this.currentTaskText = this.currentTask.title;
      }
    },
   
  },
  computed: {
    ...mapGetters(['getColor', 'getIcon']),
  },
  mounted() {
   this.currentTaskText = this.currentTask.title;
   this.getState();
  },
};
</script>

<template>
  <div>
    <v-menu location="start">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-dots-vertical"
          variant="text"
          height="20"
          width="20"
          v-bind="props"
        ></v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="action(item) === 'deleteTask' ? deleteTask() : replaceTask()"
        >
          <v-tooltip activator="parent" location="end">{{
            item.title
          }}</v-tooltip>
          <v-list-item-title>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- replaceTask -->
    <v-dialog v-model="activatorProps" max-width="500">
      <template v-slot:default="{ isActive }">
        <v-card class="text-center" title="Редактирование задачи" rounded="xl">
          <v-card-text>
            <v-text-field
              placeholder="Название задачи"
              :counter="500"
              clearable
              v-model="currentTaskText"
            >
            <v-menu>
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">mdi-dots-vertical</v-icon>
                </template>
                <v-card class="pa-2">
                  <span style="color: black;">Выберите состояние</span>
                  <v-chip-group v-model="amenities1" column>
                    <v-list
                      v-for="(item, index) in itemsState.state"
                      :key="index"
                      :value="index"
                    >
                      <v-chip
                        mandatory
                        class="chips"
                        :color="item.color"
                        :prepend-icon="item.icon_status"
                        @click="replaceState(item.id)"
                      >
                        {{ item.name }}
                      </v-chip>
                    </v-list>
                  </v-chip-group>
                </v-card>
              </v-menu>
          </v-text-field>
          </v-card-text>
          <div class="d-flex justify-center">
            <v-card-actions>
              <v-btn
                color="pink-darken-1"
                variant="flat"
                text="Отмена"
                @click="isActive.value = false"
                width="220px"
                rounded="lg"
              ></v-btn>
              <v-btn
                :disabled="!currentTaskText"
                color="light-green-accent-3"
                variant="flat"
                text="Сохранить"
                :loading="loading"
                @click="updateTask()"
                width="220px"
                rounded="lg"
              ></v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<style scoped>
.v-card {
  color: rgb(255, 255, 255);
  background-image: url("../assets/fon2.jpg");
}
</style>
