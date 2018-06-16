import { SHA256, SHA384, SHA512, enc } from "crypto-js";
import { JSDOM } from "jsdom";
import * as Policies from "./policies";
import * as SandboxType from "./sandbox-types";
import * as PluginType from "./plugin-types";

export { Policies };

type SandboxTypes = typeof SandboxType.AllowForms;
type PluginTypes = typeof PluginType.Pdf;
type PolicyTypes = typeof Policies.Self;
type SrcValues = typeof Policies.None | typeof Policies.Any | PolicyTypes | Array<PolicyTypes>;

export interface ContentSecurityPolicyInfo {
    defaultSrc?: SrcValues; // default none
    scriptSrc?: SrcValues; // default self
    styleSrc?: SrcValues; // default self
    imgSrc?: SrcValues; // default self
    connectSrc?: SrcValues; // default self
    fontSrc?: SrcValues; // default empty
    objectSrc?: SrcValues; // default empty
    mediaSrc?: SrcValues; // default empty
    frameSrc?: SrcValues; // default empty depreacted should use child-src now
    sandbox?: Array<SandboxTypes>; // default empty
    reportUri?: string; // default empty
    reportOnly?: boolean; // default empty
    childSrc?: SrcValues; // default empty
    formAction?: SrcValues; // default empty
    frameAncestors?: SrcValues; // default empty
    pluginTypes?: Array<PluginTypes>; // default empty
}

export class ContentSecurityPolicy implements ContentSecurityPolicyInfo {
    defaultSrc: Array<PolicyTypes> = []; // default none
    scriptSrc: Array<PolicyTypes> = []; // default self
    styleSrc: Array<PolicyTypes> = []; // default self
    imgSrc: Array<PolicyTypes> = []; // default self
    connectSrc: Array<PolicyTypes> = []; // default self
    fontSrc: Array<PolicyTypes> = []; // default empty
    objectSrc: Array<PolicyTypes> = []; // default empty
    mediaSrc: Array<PolicyTypes> = []; // default empty
    frameSrc: Array<PolicyTypes> = []; // default empty depreacted should use child-src now
    sandbox: Array<SandboxTypes> = []; // default empty
    reportUri?: string; // default empty
    reportOnly?: boolean; // default empty
    childSrc: Array<PolicyTypes> = []; // default empty
    formAction: Array<PolicyTypes> = []; // default empty
    frameAncestors: Array<PolicyTypes> = []; // default empty
    pluginTypes: Array<PluginTypes> = []; // default empty

    public constructor(policyInfo: ContentSecurityPolicyInfo) {
        Object.keys(policyInfo).forEach(key => {
            const policyInfoValue = (policyInfo as any)[key];
            (this as any)[key] = policyInfoValue || [];
        });
    }

    public addScript(scriptContent: string): ContentSecurityPolicy {
        return new ContentSecurityPolicy({
            ...this as ContentSecurityPolicyInfo,
            scriptSrc: [ ...this.scriptSrc, `'sha256-${SHA256(scriptContent).toString(enc.Base64)}'` as any as PolicyTypes ]
        })
    }

    public addStyle(styleContent: string): ContentSecurityPolicy {
        return new ContentSecurityPolicy({
            ...this as ContentSecurityPolicyInfo,
            styleSrc: [ ...this.styleSrc, `'sha256-${SHA256(styleContent).toString(enc.Base64)}'` as any as PolicyTypes ]
        })
    }

    public addDocument(documentContent: string): ContentSecurityPolicy {
        let newCsp = this as ContentSecurityPolicy;

        const document = new JSDOM(documentContent).window.document;
        const scriptHashes = document.querySelectorAll("script").forEach(script => {
            if (!script.innerHTML) {
                return;
            }

            newCsp = newCsp.addScript(script.innerHTML);
        });

        const styleHashes = document.querySelectorAll("style").forEach(style => {
            if (!style.innerHTML) {
                return;
            }

            newCsp = newCsp.addStyle(style.innerHTML);
        });

        return newCsp;
    }

    public getHeaderValue() {
        return Object.keys(this).map(key => {
            const value = (this as any)[key];

            if (!value || value.length === 0) {
                return "";
            }

            const policyName = key.replace(/([a-z]+)([A-Z][a-z])+/, "$1-$2").toLowerCase();
            return `${policyName} ${value instanceof Array ? value.join(" ") : value};`;
        }).join("");
    }
}
