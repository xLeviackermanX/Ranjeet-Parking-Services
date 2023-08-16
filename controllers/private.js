const getPrivateData = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods",
  "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.status(200).json({
    success: true,
    data: "You got access to the private data in this route",
  });
};

module.exports = { getPrivateData };
