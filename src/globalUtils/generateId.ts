const { v4: uuidv4 } = require("uuid");

export const generateId = () => {
  return uuidv4();
};
