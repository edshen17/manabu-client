import axios from 'axios';

const fetchMyTeachers = async () => {
  const res = await axios
    .get(`/api/myTeachers`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .catch((err) => {
      throw err;
    });
  return res.data;
};

export default fetchMyTeachers;
