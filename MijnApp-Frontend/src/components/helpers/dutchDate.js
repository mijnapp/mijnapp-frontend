const dag = (date, kort) => {
  let dagen = [
    'Zondag',
    'Maandag',
    'Dinsdag',
    'Woensdag',
    'Donderdag',
    'Vrijdag',
    'Zaterdag',
  ];
  if (kort) {
    dagen = dagen.map((i) => i.substring(0, 2));
  }
  return dagen[date.getDay()];
};

const maand = (date, kort) => {
  let maanden = [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ];
  if (kort) {
    maanden = maanden.map((i) => (i.length < 6 ? i : i.substring(0, 3)));
  }
  return maanden[date.getMonth()];
};

export const time = (date) => {
  const h = date.getHours();
  const m = date.getMinutes();
  return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}`;
};

export const toDutchDate = (date, kort) => {
  if (date && typeof date.getMonth === 'function') {
    return `${date.getDate()} ${maand(date, kort)}${
      kort
        ? date.getFullYear() === new Date().getFullYear()
          ? ''
          : ` ${date.getFullYear()}`
        : ` ${date.getFullYear()}`
    }`;
  }
  return '';
};

export const toDutchDateTime = (date, kort) => {
  if (date && typeof date.getMonth === 'function') {
    return `${toDutchDate(date, kort)} ${time(date)}`;
  }
  return '';
};

export const fromDutchDateString = (dateString) => {
  var day = parseInt(dateString.substring(0, 2));
  var month = parseInt(dateString.substring(3, 5));
  var year = parseInt(dateString.substring(6, 10));

  return new Date(year, month - 1, day);
};
