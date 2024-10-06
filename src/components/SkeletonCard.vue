<template function>
  <v-col>
    <v-card
      :color="color"
      :style="{ 'border-top': '10px solid gray' }"
      :class="{ 'highlight-border': highlightedColumn === 'planned' }"
    >
      <v-card-title class="text-center">
       {{nameBlock}}
      </v-card-title>
      <v-card-text class="scrollable-container">
        <v-skeleton-loader color="transparent" type="button"></v-skeleton-loader>
        <v-skeleton-loader color="transparent" type="list-item, list-item, list-item, list-item"></v-skeleton-loader>
    </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "gray",
    },
    nameBlock: String
  },
};
</script>
<style scoped>
.v-card {
  border-radius: 20px;
}
</style>


