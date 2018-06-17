import { Policies } from "cspeasy";
import * as Express from "express";
import { resolve } from "path";
import { createContentSecurityPolicy } from "../src/main";

const app = Express();

app.use(createContentSecurityPolicy({
    defaultSrc: Policies.None,
    documents: [ resolve("test/index.html") ]
}));

app.use((request, response) => {
    response.sendFile("test/index.html");
});

const port = 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
