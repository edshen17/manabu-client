import axios from 'axios';

async function getUserData() {
    // get token from local storage to use in routes 
    const res = await axios.get('http://localhost:5000/api/me', { headers: {
        'X-Requested-With': 'XMLHttpRequest'
      } 
    }).catch((err) => {});
      return res;
}

export default getUserData;