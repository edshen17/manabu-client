import axios from 'axios';

async function getUserData() {
    const res = await axios.get('http://localhost:5000/api/me', { headers: {
        'X-Requested-With': 'XMLHttpRequest'
      } 
    }).catch((err) => {});
      return res;
}

export default getUserData;