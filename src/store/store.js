import axios from 'axios';
import Vuex from 'vuex'
const baseUrl = "http://127.0.0.1:8000";
const store = new Vuex.Store({
  state: {},
  getters: {
    getColor: (state) => (name) => {
      const color = {
        Срочно: "red",
        "Не срочно": "success",
        Важно: "orange",
      };
      return color[name];
    },
    getIcon: (state) => (name) => {
      const icons = {
        Срочно: "mdi-calendar",
        "Не срочно": "mdi-checkbox-marked-circle",
        Важно: "mdi-alert-circle",
      };
      return icons[name];
    },
    
  },
  mutations: {
    // addCard(state, card) {
    //   const { id, title,  price, img } = card
    //   state.DrawerList.unshift({ id, title,  price, img })
    //   state.DrawerSum = state.DrawerList.reduce((acc, item) => (acc += item.price), 0)
    // },

  },
  actions: {
    // addCard({ commit }, card) {
    //   commit('addCard', card)
    // },
  }
})

export default store
