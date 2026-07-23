const createRepairNumber = (req, res, next) => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);

  req.repairNumber = `REQ-${year}${month}${day}-${random}`;

  next();
};

export default createRepairNumber;