export const catchAsync = (asyncCb) => {
  return (req, res, next) => {
    asyncCb(req, res, next).catch((err) => {
      next(err);
    });
    // OR
    // asyncCb(req, res, next).catch(next);
  };
};
