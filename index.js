const server = require("./app");

let port = process.env.PORT || 3000;


server.listen({ port }).then((res) => {
    console.log(`Server ready at ${res.url}`);
});
