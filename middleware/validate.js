const requireFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missing.length > 0) {
    res.status(400);
    return next(new Error(`Missing required fields: ${missing.join(", ")}`));
  }

  next();
};

module.exports = { requireFields };
