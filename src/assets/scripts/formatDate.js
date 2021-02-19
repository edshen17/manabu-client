import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

const formatDate = (dateStr, format) => {
    if (format == 'fromNow') {
        return dayjs().fromNow();
    } else {
        return dayjs(dateStr).format(format);
    }
}

export default formatDate;