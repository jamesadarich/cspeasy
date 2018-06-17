# cspeasy-express

A simple way to setup Content Security Policy even with inline scripts and styles in express!

It digests HTML documents so you can have a strong CSP with necessary inline scripts and styles (e.g. Google Analytics).

## Example

```javascript
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
```

