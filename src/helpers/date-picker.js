const datePicker = () => {
  const convertToMs = (day) => {
    return day * 60 * 60 * 24 * 1000;
  };
  const convertDay = (dayNum) => {
    const date = +new Date();
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

export default datePicker;
