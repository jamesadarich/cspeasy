# cspeasy

A simple way to setup Content Security Policy even with inline scripts and styles!

It digests HTML documents so you can have a strong CSP with necessary inline scripts and styles (e.g. Google Analytics).

## Example

`npm install cspeasy --save`

```javascript
import { createServer } from "http";
import { readFile } from "fs";
import { resolve } from "path";
import { ContentSecurityPolicy, Policies } from "cspeasy";

const server = createServer((req, res) => {
    const csp = new ContentSecurityPolicy({
        defaultSrc: Policies.None,
    });

    readFile(resolve("test/index.html"), null, (error, data) => {
        if (error) {
            throw error;            
        }

        const indexString = data.toString();

        const hashedCsp = csp.addDocument(indexString);

        res.setHeader("Content-Security-Policy", hashedCsp.getHeaderValue());

        res.end(indexString);
    });
});

const port = 3000;

server.listen(port, () => console.log(`listening on ${port}`));
```

