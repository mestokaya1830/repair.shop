import { repairNumber } from "../utils/repair.number.js";

const createRepairNumber = (req, res, next) => {
  req.repairNumber = repairNumber();
  next();
};

export default createRepairNumber;