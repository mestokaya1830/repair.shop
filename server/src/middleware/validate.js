const validate = (schema) => (req, res, next) => {
  try {
    let data = req.body;

    if (req.body.data) {
      data = JSON.parse(req.body.data);
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
