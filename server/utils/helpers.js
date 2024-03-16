const DAILY = "daily";
const MONTHLY = "monthly";
const YEARLY = "yearly";

const resolveDateRange = (frame, range) => {
  const from = new Date();
  const to = new Date();
  // subtract one from the range as today is included
  range = range - 1;

  switch (frame) {
    case DAILY: {
      from.setDate(from.getDate() - range);
      break;
    }
    case MONTHLY: {
      from.setMonth(from.getMonth() - range);
      from.setDate(1);
      break;
    }
    case YEARLY: {
      from.setFullYear(from.getFullYear() - range);
      from.setMonth(0);
      from.setDate(1);
      break;
    }
    default: {
      break;
    }
  }

  from.setHours(0, 0, 0, 0);

  return { from, to };
};

// Convert a valid Date object to the proper date display based on provided time frame. 
const formatISODateByFrame= (date, frame) => {
  const year = date.getFullYear();
  const month = date.getMonth(); 
  const day = date.getDate();

  if (frame === DAILY) {
    return new Date(year, month, day).toISOString().split('T')[0]; // Truncate time part
  } else if (frame === MONTHLY) {
    return new Date(year, month).toISOString().split('T')[0]; // First day of the month
  } else if (frame === YEARLY) {
    return new Date(year, 0).toISOString().split('T')[0]; // First day of the year
  }
}

module.exports = {
  DAILY,
  MONTHLY,
  YEARLY,
  resolveDateRange,
  formatISODateByFrame,
};
