import { Expect, Test, TestCase, TestFixture } from "alsatian";
import { SHA256, enc } from "crypto-js";
import { ContentSecurityPolicy, Policies } from "./main";

@TestFixture("")
export class ContentSecurityPolicyTests {

    @Test()
    public isImmutable() {
        const csp = new ContentSecurityPolicy({});

        Expect(csp.addScript("")).not.toBe(csp);
    }

    @TestCase(Policies.Self, "default-src 'self';")
    @TestCase(Policies.None, "default-src 'none';")
    @TestCase(Policies.Any, "default-src *;")
    @Test("single value default-src")
    public basicDefaultSrcValue(policy: any, expectedHeaderValue: string) {
        const csp = new ContentSecurityPolicy({
            defaultSrc: policy
        });

        Expect(csp.getHeaderValue()).toBe(expectedHeaderValue);
    }

    @TestCase(Policies.Self, "script-src 'self';")
    @TestCase(Policies.None, "script-src 'none';")
    @TestCase(Policies.Any, "script-src *;")
    @Test("single value script-src")
    public basicScriptSrcValue(policy: any, expectedHeaderValue: string) {
        const csp = new ContentSecurityPolicy({
            scriptSrc: policy
        });

        Expect(csp.getHeaderValue()).toBe(expectedHeaderValue);
    }

    @TestCase(Policies.Self, "style-src 'self';")
    @TestCase(Policies.None, "style-src 'none';")
    @TestCase(Policies.Any, "style-src *;")
    @Test("single value style-src")
    public basicStyleSrcValue(policy: any, expectedHeaderValue: string) {
        const csp = new ContentSecurityPolicy({
            styleSrc: policy
        });

        Expect(csp.getHeaderValue()).toBe(expectedHeaderValue);
    }
    
    @Test("single hash script-src")
    public singleHashScript() {
        const csp = new ContentSecurityPolicy({});
        
        const scriptContent = "console.log('inline script');";
        const hashedCsp = csp.addScript(scriptContent);

        Expect(hashedCsp.getHeaderValue()).toBe(`script-src 'sha256-${SHA256(scriptContent).toString(enc.Base64)}';`);
    }
    
    @Test("two hash script-src")
    public twoHashScript() {
        const csp = new ContentSecurityPolicy({});
        
        const scriptContent = "console.log('inline script');";
        const secondScriptContent = "console.log('another script');";
        const hashedCsp = csp.addScript(scriptContent).addScript(secondScriptContent);

        Expect(hashedCsp.getHeaderValue()).toBe(`script-src 'sha256-${SHA256(scriptContent).toString(enc.Base64)}' 'sha256-${SHA256(secondScriptContent).toString(enc.Base64)}';`);
    }

    @Test("single script extracted from HTML document")
    public singleHashExtracted() {
        const csp = new ContentSecurityPolicy({});
        
        const scriptContent = "console.log('inline script');";
        const document = `<!DOCTYPE html><html><head><script>${scriptContent}</script></head><body>HTML</body></html>`;
        const hashedCsp = csp.addDocument(document);

        Expect(hashedCsp.getHeaderValue()).toBe(`script-src 'sha256-${SHA256(scriptContent).toString(enc.Base64)}';`);
    }
}
