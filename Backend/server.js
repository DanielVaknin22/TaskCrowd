const appInit = require("./App");
const port = process.env.PORT;

appInit().then((app) => {
    app.listen(process.env.PORT, () => {
        console.log(`app listening at http://185.159.109.243:${port}`);
    });
});