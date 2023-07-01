const datePicker = (defaultDate) => {
  const convertDay = (dayNum) => {
    const date = defaultDate ? new Date(defaultDate) : new Date();
    date.setDate(date.getDate() + dayNum);
    return date;
  };
  const firstDay = convertDay(-2);
  const secondDay = convertDay(-1);
  const thirdDay = convertDay(0);
  const fourthDay = convertDay(1);
  const fifthDay = convertDay(2);
  return [firstDay, secondDay, thirdDay, fourthDay, fifthDay];
};
const monthToDateConverter = (month) => {
  // Using map after a long time :)
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
export const getTimeZoneOffSet = () => {
  const date = new Date();
  // Get the timezone offset in minutes
  const timezoneOffset = date.getTimezoneOffset();

  // Convert the timezone offset to hours and minutes
  const hours = Math.floor(Math.abs(timezoneOffset) / 60);
  const minutes = Math.abs(timezoneOffset) % 60;
  const timezoneOffsetSign = timezoneOffset > 0 ? '-' : '+';
  return `${timezoneOffsetSign}${hours}:${minutes}`;
};

export const convertDateForDisplay = (date, sport) => {
  const [dateStr, timeStr] = date.split(' ');
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const [hourStr, minuteStr] = timeStr.split(':');
  const refinedHourStr = hourStr === '24' ? '00' : hourStr;
  if (sport === 'football') {
    return { displayTime: `${refinedHourStr}:${minuteStr}` };
  }
  const [year, month, day, hour, minute] = [
    +yearStr,
    +monthStr,
    +dayStr,
    +hourStr,
    +minuteStr,
  ];
  // month-1 because javascript takes january as 0 and feb as 1.
  const convertedDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const displayTime = String(convertedDate).split(' ').at(4).slice(0, 5);
  return { displayTime, convertedDate };
};
export const competitionDateHandler = (date, mode) => {
  console.log(date);
  const { displayTime, convertedDate } = convertDateForDisplay(date);
  // reverse because localeString gives in fEb 20 and we need 20 Feb
  const displayDate = convertedDate
    .toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
    })
    .split(' ')
    .reverse()
    .join(' ');
  return { displayDate, displayTime };
};

export default datePicker;
