export const generateRepairNumber = () => {
  const date = new Date();
  return `REQ-${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}${String(date.getDate()).padStart(2, "0")}-${Math.floor(
    1000 + Math.random() * 9000,
  )}`;
};
