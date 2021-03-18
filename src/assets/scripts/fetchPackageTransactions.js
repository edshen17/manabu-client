import axios from 'axios';

const fetchPackageTransactions = async (uId) => {
    const res = await axios.get(`/api/transaction/packageTransaction/user/${uId}`, { headers: {
        'X-Requested-With': 'XMLHttpRequest'
      } 
    }).catch((err) => { throw err });
    return res.data;
}

export default fetchPackageTransactions;