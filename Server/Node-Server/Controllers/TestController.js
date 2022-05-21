require("dotenv").config();

const jwt = require("jsonwebtoken");
const testUsers = new Map([
  ["ayo", "9a4ocgo8l37gja7z"],
  ["bola", "9a4ocgo8l37dfji"],
  ["seyi", "9a4ocgo8l37geitl"],
]);

const testJwt = async (req, res) => {
  const { username, email } = req.body;
  const testUser = testUsers.get(username);
  if (testUser) {
    const token = jwt.sign({ username, userid: testUser }, process.env.SECRET);
    res.cookie("token", token, { maxAge: 60 * 60 * 24 * 1000 });
    res.json({ token, success: "ok" });
  } else {
    res
      .status(400)
      .json({ message: "This test user doesn't exist", success: "false" });
    console.log("Invalid test user", username);
  }
};

module.exports = { testJwt };
