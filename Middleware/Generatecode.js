// Generate a unique student code
const generateStudentCode = () => {
  const prefix = "VCA-P";
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
};

module.exports = generateStudentCode;
