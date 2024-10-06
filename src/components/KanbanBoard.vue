<script>
import draggable from "vuedraggable";

const baseUrl = "http://127.0.0.1:8000";
import axios from "axios";
import ContextMenu from "./ContextMenu.vue";
import Skeleton from "./SkeletonCard.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    draggable,
    Skeleton,
    ContextMenu,
  },
  data() {
    return {
      loading: false,
      isCompleted: false,
      openTextFieldPlanned: false,
      openTextFieldDevelopment: false,
      openTextFieldSuccess: false,
      IsaddStateTask: false,
      highlightedColumn: null,
      newTaskPlanned: "",
      newTaskDevelopment: "",
      newTaskSuccess: "",
      add: false,
      stateTaskPlanned: null,
      stateTaskDevelopment: null,
      stateTaskSuccess: null,
      nameStatePlanned: "",
      nameStateDevelopment: "",
      nameStateSuccess: "",
      isloading: false,
      circularPlanned: false,
      circularDevelopment: false,
      circularSuccess: false,
      fromTable: "",
      movableElement: null,
      open: ["Users"],
      admins: [
        ["Management", "mdi-account-multiple-outline"],
        ["Settings", "mdi-cog-outline"],
      ],
      cruds: [
        ["Create", "mdi-plus-outline"],
        ["Read", "mdi-file-outline"],
        ["Update", "mdi-update"],
        ["Delete", "mdi-delete"],
      ],
      items: [],
      planned: [],
      development: [],
      success: [],
    };
  },
  methods: {
    async getState() {
      const response = await axios.get(`${baseUrl}/getState`);
      this.items = response.data;
    },
    async addTask(table, state) {
      if (
        !this.newTaskPlanned.trim() &&
        !this.newTaskDevelopment.trim() &&
        !this.newTaskSuccess.trim()
      ) {
        return;
      }
      switch (table) {
        case "Запланировано":
          await this.postTask(table, this.newTaskPlanned, state);
          this.newTaskPlanned = "";
          this.stateTaskPlanned = null;
          break;

        case "В разработке":
          await this.postTask(table, this.newTaskDevelopment, state);
          this.newTaskDevelopment = "";
          this.stateTaskDevelopment = null;
          break;

        case "Готово":
          await this.postTask(table, this.newTaskSuccess, state);
          this.newTaskSuccess = "";
          this.stateTaskSuccess = null;
          break;
      }
    },
    async postTask(tableName, title, id_state) {
      await axios.post(`${baseUrl}/newTask`, {
        table: tableName,
        title: title,
        id_state: id_state,
      });
      await this.onUpdateListTask(tableName);
    },

    addStateTaskPlanned(id_state, name) {
      this.stateTaskPlanned = id_state;
      this.nameStatePlanned = name;
    },
    addStateTaskDevelopment(id_state, name) {
      this.stateTaskDevelopment = id_state;
      this.nameStateDevelopment = name;
    },
    addStateTaskSuccess(id_state, name) {
      this.stateTaskSuccess = id_state;
      this.nameStateSuccess = name;
    },

    logPlanned(evt) {
      if (evt.added) {
        this.fromTable = "Запланировано";
        this.movableElement = evt.added.element;
      } else if (evt.removed) {
        this.movableElement = evt.removed.element;
      } else if (evt.moved) {
        console.log(evt);
        this.movableElement = evt.moved.element;
      }
    },
    logDevelopment(evt) {
      if (evt.added) {
        this.fromTable = "В разработке";
        this.movableElement = evt.added.element;
      } else if (evt.removed) {
        this.movableElement = evt.removed.element;
      } else if (evt.moved) {
        this.movableElement = evt.moved.element;
      }
    },
    logSuccess(evt) {
      if (evt.added) {
        this.fromTable = "Готово";
        this.movableElement = evt.added.element;
      } else if (evt.removed) {
        this.movableElement = evt.removed.element;
      } else if (evt.moved) {
        this.movableElement = evt.moved.element;
      }
    },
    async onTaskDrop(evt, toTable) {
      if (!this.fromTable || !this.movableElement) return;

      await axios.post(`${baseUrl}/moveTask`, {
        fromTable: this.fromTable,
        toTable: toTable,
        id: this.movableElement.id,
        title: this.movableElement.title,
        id_state: this.movableElement.id_state,
        position: evt.newIndex, // передаем новую позицию
      });

      // Перемещение задачи завершено, обновляем задачи
      await this.getTasks();
      this.fromTable = "";
      this.movableElement = null;
    },
    // getTableByTask(task) {
    //   if (this.planned.includes(task)) return "Запланировано";
    //   if (this.development.includes(task)) return "В разработке";
    //   if (this.success.includes(task)) return "Готово";
    // },

    async getTasks() {
      const resp = await axios.get(`${baseUrl}/kanban`);
      this.planned = resp.data.planned;
      this.development = resp.data.development;
      this.success = resp.data.success;
      this.loading = false;
    },
    getTableName(tableName) {
      const tables = {
        Запланировано: "planned",
        "В разработке": "development",
        Готово: "success",
      };
      return tables[tableName];
    },
    async onUpdateListTask(tableName) {
      try {
        const resp = await axios.get(`${baseUrl}/updateListTask`, {
          params: {
            table: tableName,
          },
        });
        this[this.getTableName(tableName)] = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    isloading(val) {
      if (!val) return;
      setTimeout(() => (this.isloading = false), 500);
    },
  },
  computed: {
    ...mapGetters(["getColor", "getIcon"]),
  },
  mounted() {
    this.loading = true;
    this.getTasks();
    this.getState();
    // console.log(this.$router.options.routes);
  },
};
</script>

<template>
  <v-container fluid>
    <v-row class="pa-0">
      <v-col cols="3" rounded="circle">
        <Skeleton color="#FCFFD4" nameBlock="Запланировано" v-if="loading" />
        <v-card
          max-width="300"
          v-else
          color="#FCFFD4"
          :style="{ 'border-top': '10px solid #FADA4E' }"
          :class="{ 'highlight-border': highlightedColumn === 'planned' }"
        >
          <v-card-title>Запланировано</v-card-title>
          <v-btn
            @click="openTextFieldPlanned = !openTextFieldPlanned"
            variant="text"
            class="ml-4"
            color="blue"
          >
            <v-icon>mdi-plus</v-icon>
            Добавить задачу
          </v-btn>
          <v-col cols="11" class="pa-0 ml-4 mt-4" v-if="openTextFieldPlanned">
            <v-text-field
              @click:append-inner="
                addTask('Запланировано', stateTaskPlanned),
                  (isloading = !isloading)
              "
              append-inner-icon="mdi-checkbox-marked-circle"
              placeholder="Название задачи"
              :counter="500"
              v-model="newTaskPlanned"
              clearable
              variant="solo"
              :loading="isloading"
            >
              <v-menu v-if="newTaskPlanned">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">mdi-dots-vertical</v-icon>
                </template>
                <v-card class="pa-2">
                  <span>Выберите состояние</span>
                  <v-chip-group v-model="amenities1" column>
                    <v-list
                      v-for="(item, index) in items.state"
                      :key="index"
                      :value="index"
                    >
                      <v-chip
                        mandatory
                        class="chips"
                        :color="item.color"
                        :prepend-icon="item.icon_status"
                        @click="addStateTaskPlanned(item.id, item.name)"
                      >
                        {{ item.name }}
                      </v-chip>
                    </v-list>
                  </v-chip-group>
                </v-card>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-card-text class="scrollable-container">
            <draggable
              v-model="planned"
              group="tasks"
              item-key="id"
              animation="200"
              ghost-class="ghost"
              chosen-class="chosen"
              @end="onTaskDrop($event, 'Запланировано')"
              @change="logPlanned"
            >
              <template #item="{ element }">
                <v-list-item rounded="2">
                  <v-list-item-content>
                    <div style="display: flex; justify-content: space-between">
                      <div>
                        <span>{{ element.title }}</span>
                      </div>
                      <div>
                        <ContextMenu
                          @updateListTask="onUpdateListTask"
                          :current-task="element"
                          tableName="Запланировано"
                        >
                        </ContextMenu>
                      </div>
                    </div>
                    <div>
                      <v-chip
                        v-if="element.name"
                        class="mt-2 mb-1"
                        :color="getColor(element.name)"
                        :prepend-icon="getIcon(element.name)"
                      >
                        {{ element.name }}
                      </v-chip>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </draggable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <Skeleton color="#F4DFFF"  nameBlock="В разработке" v-if="loading" />
        <v-card
          v-else
          color="#F4DFFF"
          max-width="300"
          :style="{ 'border-top': '10px solid #D17AF6' }"
          :class="{ 'highlight-border': highlightedColumn === 'inProgress' }"
        >
          <v-card-title>В разработке</v-card-title>
          <v-btn
            variant="text"
            @click="openTextFieldDevelopment = !openTextFieldDevelopment"
            class="ml-4"
            color="blue"
          >
            <v-icon>mdi-plus</v-icon>
            Добавить задачу
          </v-btn>
          <v-col
            cols="11"
            class="pa-0 ml-4 mt-4"
            v-if="openTextFieldDevelopment"
          >
            <v-text-field
              @click:append-inner="
                addTask('В разработке', stateTaskDevelopment),
                  (isloading = !isloading)
              "
              placeholder="Название задачи"
              :counter="500"
              v-model="newTaskDevelopment"
              clearable
              variant="solo"
              append-inner-icon="mdi-checkbox-marked-circle"
              :loading="isloading"
            >
              <v-menu v-if="newTaskDevelopment">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">mdi-dots-vertical</v-icon>
                </template>
                <v-card class="pa-2">
                  <span>Выберите состояние</span>
                  <v-chip-group v-model="amenities2" column>
                    <v-list
                      v-for="(item, index) in items.state"
                      :key="index"
                      :value="index"
                    >
                      <v-chip
                        mandatory
                        class="chips"
                        :color="item.color"
                        :prepend-icon="item.icon_status"
                        @click="addStateTaskDevelopment(item.id, item.name)"
                      >
                        {{ item.name }}
                      </v-chip>
                    </v-list>
                  </v-chip-group>
                </v-card>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-card-text class="scrollable-container">
            <draggable
              v-model="development"
              group="tasks"
              item-key="id"
              animation="200"
              ghost-class="ghost"
              chosen-class="chosen"
              @end="onTaskDrop($event, 'В разработке')"
              @change="logDevelopment"
            >
              <template #item="{ element }">
                <v-list-item rounded="2">
                  <div style="display: flex; justify-content: space-between">
                    <div>
                      <span>{{ element.title }}</span>
                    </div>
                    <div>
                      <ContextMenu
                        @updateListTask="onUpdateListTask"
                        :current-task="element"
                        tableName="В разработке"
                      >
                      </ContextMenu>
                    </div>
                  </div>
                  <v-list-item-content>
                    <div>
                      <v-chip
                        v-if="element.name"
                        class="mt-2 mb-1"
                        :color="getColor(element.name)"
                        :prepend-icon="getIcon(element.name)"
                      >
                        {{ element.name }}
                      </v-chip>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </draggable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <Skeleton color="#E1FFE8"  nameBlock="Готово" v-if="loading" />
        <v-card
          v-else
          color="#E1FFE8"
          max-width="300"
          :style="{ 'border-top': '10px solid #27E1A9' }"
          :class="{ 'highlight-border': highlightedColumn === 'testing' }"
        >
          <v-card-title>Готово</v-card-title>
          <v-btn
            variant="text"
            class="ml-4"
            @click="openTextFieldSuccess = !openTextFieldSuccess"
            color="blue"
          >
            <v-icon>mdi-plus</v-icon>
            Добавить задачу
          </v-btn>
          <v-col cols="11" class="pa-0 ml-4 mt-4" v-if="openTextFieldSuccess">
            <v-text-field
              :counter="500"
              placeholder="Название задачи"
              @click:append-inner="
                addTask('Готово', stateTaskSuccess), (isloading = !isloading)
              "
              v-model="newTaskSuccess"
              clearable
              append-inner-icon="mdi-checkbox-marked-circle"
              variant="solo"
              :loading="isloading"
            >
              <v-menu v-if="newTaskSuccess">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">mdi-dots-vertical</v-icon>
                </template>
                <v-card class="pa-2">
                  <span>Выберите состояние</span>
                  <v-chip-group v-model="amenities3" column>
                    <v-list
                      v-for="(item, index) in items.state"
                      :key="index"
                      :value="index"
                    >
                      <v-chip
                        mandatory
                        class="chips"
                        :color="item.color"
                        :prepend-icon="item.icon_status"
                        @click="addStateTaskSuccess(item.id, item.name)"
                      >
                        {{ item.name }}
                      </v-chip>
                    </v-list>
                  </v-chip-group>
                </v-card>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-card-text class="scrollable-container">
            <draggable
              v-model="success"
              group="tasks"
              item-key="id"
              animation="200"
              ghost-class="ghost"
              chosen-class="chosen"
              @end="onTaskDrop($event, 'Готово')"
              @change="logSuccess"
            >
              <template #item="{ element }">
                <v-list-item rounded="2">
                  <div style="display: flex; justify-content: space-between">
                    <div>
                      <span>{{ element.title }}</span>
                    </div>
                    <div>
                      <ContextMenu
                        @updateListTask="onUpdateListTask"
                        :current-task="element"
                        tableName="Готово"
                      >
                      </ContextMenu>
                    </div>
                  </div>
                  <v-list-item-content>
                    <div>
                      <v-chip
                        v-if="element.name"
                        class="mt-2 mb-1"
                        :color="getColor(element.name)"
                        :prepend-icon="getIcon(element.name)"
                      >
                        {{ element.name }}
                      </v-chip>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </draggable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.highlight-border {
  border: 10px dashed #cc0000;
}

.ghost {
  opacity: 0.4;
  border: 2px dashed #52db9d;
}

.chosen {
  background-color: #e9eaea;
}

.v-card {
  border-radius: 20px;
}

.v-container {
  padding: 0;
}
.v-card-title {
  display: flex;
  justify-content: center;
}

.v-list-item {
  box-shadow: 2px 2px rgba(0, 0, 0, 0.3);
  margin-bottom: 5px;
  background: #ffffff;
  border-radius: 1ch;
}

.v-list-item-title {
  word-wrap: break-word;
}

.v-list-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scrollable-container {
  max-height: 500px;
  overflow-x: hidden;
}

.text-input {
  background: white;
  border: 1px solid white;
  width: 100%;
  height: 4vh;
  color: black;
  font-size: 16px;
  padding: 0;
  margin: 0;
}

.card-text {
  word-wrap: break-word;
  font-size: 15px;
}

.menu-task {
  margin-left: 100px;
}

.task-completed {
  opacity: 0.5;
}
</style>
