import axios from 'axios';

async function getAppointments(uId, isReservee, startWeekDay, endWeekDay) {
    const res = await axios.get(`http://localhost:5000/api/schedule/${uId}/appointment/${startWeekDay}/${endWeekDay}?isHost=${!isReservee}`, { headers: {
        'X-Requested-With': 'XMLHttpRequest'
      } 
    }).catch((err) => {});
      return res.data;
}

export default getAppointments;