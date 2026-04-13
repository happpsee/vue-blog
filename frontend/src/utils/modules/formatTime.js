const padLeft = (value) => {
  value = String(value);
  if (value.length !== 1) {
    return value;
  }
  return '0' + value;
};

export const formatTime = (date, format = "yyyy-mm-dd") => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const regexpMap = {
    "y+": date.getFullYear(),
    "m+": padLeft(date.getMonth() + 1),
    "d+": padLeft(date.getDate()),
    "h+": padLeft(date.getHours()),
    "(?:mi)+": padLeft(date.getMinutes()),
  };

  for (const [key, value] of Object.entries(regexpMap)) {
    format = format.replace(new RegExp(key), value);
  }

  return format; 
};
