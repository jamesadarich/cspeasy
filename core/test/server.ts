import { createServer } from "http";
import { readFile } from "fs";
import { ContentSecurityPolicy, Policies } from "../src/main";
import { resolve } from "path";

const server = createServer((req, res) => {
    const csp = new ContentSecurityPolicy({
        defaultSrc: Policies.None
    });

    readFile(resolve("test/index.html"), null, (error, data) => {
        if (error) {
            console.log("ERROR", error);
        }

        const indexString = data.toString();

        const hashedCsp = csp.addDocument(indexString);

        res.setHeader("Content-Security-Policy", hashedCsp.getHeaderValue());

        res.end(indexString);
    });
});

server.listen(3000, () => console.log("listening on 3000"));
