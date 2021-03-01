import axios from 'axios';

async function fetchPackageData(teacherId) {
    const res = await axios.get(`/api/transaction/package/${teacherId}`, { headers: {
        'X-Requested-With': 'XMLHttpRequest'
      } 
    }).catch((err) => {throw err; });
    return res.data;
}

export default fetchPackageData;