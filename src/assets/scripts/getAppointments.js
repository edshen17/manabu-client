import axios from 'axios';

async function getAppointments(uId, startWeekDay, endWeekDay) {
    const res = await axios.get(`http://localhost:5000/api/schedule/${uId}/appointment/${startWeekDay}/${endWeekDay}`, { headers: {
        'X-Requested-With': 'XMLHttpRequest'
      } 
    }).catch((err) => { console.log(err) });
      return res.data;
}

export default getAppointments;