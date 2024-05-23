const userRouter = require("../routes/userRouter");
const chatRouter = require("../routes/chatRouter");

module.exports = function (app) {
    app.use("/user",userRouter);
    app.use("/chat",chatRouter);
}