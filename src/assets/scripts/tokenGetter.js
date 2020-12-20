import axios from 'axios';

async function getUserData() {
    // get token from local storage to use in routes 
    const res = await axios.get('http://localhost:5000/api/me', { headers: {
        'x-access-token': localStorage.getItem('token'),
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
      } 
    }).catch((err) => console.log(err));
      return res;
}

export default getUserData;