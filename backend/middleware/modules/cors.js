
const cors = require("cors");


const setupCors = (app) => {
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }))
}

module.exports = {
  setupCors
};