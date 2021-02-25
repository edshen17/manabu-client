import axios from 'axios';

async function getAppointments(uId, startWeekDay, endWeekDay) {
    const res = await axios.get(`/api/schedule/${uId}/appointment/${startWeekDay}/${endWeekDay}`, { headers: {
        'X-Requested-With': 'XMLHttpRequest'
      } 
    }).catch((err) => { console.log(err) });
      return res.data;
}

export default getAppointments;