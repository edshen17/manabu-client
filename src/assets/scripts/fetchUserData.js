import axios from 'axios';

async function fetchUserData(uId) {
  const res = await axios
    .get(`/api/user/${uId}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .catch((err) => {
      throw err;
    });
  return res.data;
}

export default fetchUserData;
