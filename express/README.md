# cspeasy-express

A simple way to setup Content Security Policy even with inline scripts and styles in express!

It digests HTML documents so you can have a strong CSP with necessary inline scripts and styles (e.g. Google Analytics).

## Example

```javascript
import { createContentSecurityPolicy } from "../src/main";

const app = Express();

app.use(createContentSecurityPolicy({
    defaultSrc: Policies.None,
    documents: [ resolve("test/index.html") ]
}));
```

