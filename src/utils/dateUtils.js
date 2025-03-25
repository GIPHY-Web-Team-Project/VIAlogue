export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const options = isToday ? { hour: '2-digit', minute: '2-digit' } : { hour: '2-digit', minute: '2-digit', weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' };

    return date.toLocaleString(undefined, options);
};

export const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const options = isToday ? { hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'numeric', year: 'numeric' };

    return date.toLocaleString(undefined, options);
};