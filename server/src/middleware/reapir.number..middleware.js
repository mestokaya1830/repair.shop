import { generateRepairNumber } from "../utils/repair.number.js";

const createRepairNumber = (req, res, next) => {
  req.repairNumber = generateRepairNumber();
  next();
};

export default createRepairNumber;