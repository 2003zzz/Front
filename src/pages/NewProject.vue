<script>
export default {
  data() {
    return {
      countBlock: 1,
      nameProject: "",
    };
  },
  methods: {
    createProject(){
      if(this.nameProject == "" || this.countBlock <= 0 ) return
      
    }
  },
};
</script>

<template>
  <v-container fluid>
    <v-col cols="10">
      <v-card title="Создание проекта">
        <v-card-title
          >Название проекта*
          <v-text-field
            :counter="55"
            variant="solo"
            :max-width="400"
            v-model="nameProject"
          ></v-text-field>
        </v-card-title>
        <v-card-title
          >Количество блоков задач
          <v-text-field
            :width="95"
            variant="solo"
            v-model="countBlock"
            prepend-inner-icon="mdi-minus"
            append-inner-icon="mdi-plus"
            @click:append-inner="countBlock++"
            @click:prepend-inner="countBlock--"
          >
          </v-text-field>
          Введите названия каждого блока
          <v-row>
            <v-col cols="3" v-for="n in countBlock" :key="n">
              <v-text-field :width="220" :counter="25" variant="solo" placeholder="Пусто"></v-text-field>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-actions>
          <v-btn
            color="light-green-accent-3
"
            variant="elevated"
            text="Создать"
            :loading="loading"
            @click="createProject()"
            width="220px"
            rounded="lg"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-container>
</template>

<style scoped>
.v-card {
  backdrop-filter: blur(15px);
  box-shadow: 0 2px 5px rgb(3, 3, 23);
  background-color: rgba(255, 255, 255, 0.2);
}
.v-card-title {
  font: 400 19px "Roboto", sans-serif;
}
.v-text-field{
  margin-top: 5px;
  font: 300 18px "Roboto", sans-serif;
}
</style>
