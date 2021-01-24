import axios from 'axios';

async function getAppointments(uId, isHost, startWeekDay, endWeekDay) {
    const res = await axios.get(`http://localhost:5000/api/schedule/${uId}/appointment/${startWeekDay}/${endWeekDay}?isHost=${isHost}`, { headers: {
        'X-Requested-With': 'XMLHttpRequest'
      } 
    }).catch((err) => {});
      return res.data;
}

export default getAppointments;