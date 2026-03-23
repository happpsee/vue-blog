export const allConfig = Object.values(import.meta.glob(["./config/fields/*.js"], {
  eager: true
})).reduce((acc, curr) => {
  const [key, value] = Object.entries(curr["default"])[0];
  acc[key] = value;
  return acc;
}, {});
