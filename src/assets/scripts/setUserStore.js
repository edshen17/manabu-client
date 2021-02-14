import axios from 'axios';

async function getUserData() {
    
}

export default getUserData;
const setUserStore = async () => {
    const user = await myUserData();
    if (user) {
      store.commit('setUserData', user.data);
    }
  }