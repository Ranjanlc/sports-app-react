const datePicker = (defaultDate) => {
  const convertToMs = (day) => {
    return day * 60 * 60 * 24 * 1000;
  };
  const convertDay = (dayNum) => {
    const date = defaultDate ? +new Date(defaultDate) : +new Date();
    const firstDay = +new Date(date - convertToMs(2));
    return new Date(firstDay + convertToMs(dayNum));
    // const day = curDate.getDate();
    // const month = curDate.toLocaleString('default', { month: 'short' });
    // return [day, month].join(' ');
  };
  const firstDay = convertDay(0);
  const secondDay = convertDay(1);
  const thirdDay = convertDay(2);
  const fourthDay = convertDay(3);
  const fifthDay = convertDay(4);
  return [firstDay, secondDay, thirdDay, fourthDay, fifthDay];
  //   console.log(new Date(prevDate));
};
const monthToDateConverter = (month) => {
  // Using map after a long tim :)
  const months = new Map([
    ['Jan', '01'],
    ['Feb', '02'],
    ['Mar', '03'],
    ['Apr', '04'],
    ['May', '05'],
    ['Jun', '06'],
    ['Jul', '07'],
    ['Aug', '08'],
    ['Sep', '09'],
    ['Oct', '10'],
    ['Nov', '11'],
    ['Dec', '12'],
  ]);
  return months.get(month);
};

export const apiDateConverter = (date) => {
  if (!date) return null;
  const [month, day, year] = String(date).split(' ').slice(1, 4);
  const numberMonth = monthToDateConverter(month);
  return `${year}-${numberMonth}-${day}`;
};

export default datePicker;
