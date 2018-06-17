import { Policies } from "cspeasy";
import express from "express";
import { resolve } from "path";
import { createContentSecurityPolicy } from "../src/main";

const app = express();

createContentSecurityPolicy({
    defaultSrc: Policies.None,
    documents: [ resolve("test/index.html") ]
}).then(policy => {
    app.use(policy);
    
    app.use((request, response) => {
        response.sendFile(resolve("test/index.html"));
    });
    
    const port = 3000;
    
    app.listen(port, () => console.log(`listening on port ${port}`));
});

