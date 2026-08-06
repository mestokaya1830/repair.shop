import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import tenantsSC from "../models/tenants.model.js";

export const index = async (req, res) => {

  try {
    const tenant = await tenantsSC.findOne();
    if (!tenant) {
      return res.status(200).json({
        company: "",
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        website: '',
        logoUrl: '',
        currency: 'EUR.de-DE',
        address: {},
        billingDetails: {},
        bankDetails: {},
      });
    }

    return res.json(tenant);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return res.status(500).json({ 
      message: 'Server error while fetching tenant profile.',
      error: error.message 
    });
  }
};


export const updateTenantProfile = async (req, res) => {
  try {
    const tenant = await tenantsSC.findOneAndUpdate(
      {},
      req.body,
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};