export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((propName) => {
    if (allowedFields.includes(propName)) newObj[propName] = obj[propName];
  });
  return newObj;
};
