const app = require("./app");

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = app;