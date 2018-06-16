import { ContentSecurityPolicyInfo, ContentSecurityPolicy } from "../core/main";
import { readFile } from "fs";

async function readFilePromise(path: string) {
    return new Promise<Buffer>((resolve, reject) => {
        readFile(path, (err, data) => err ? reject(err) : resolve(data));
    });
}

// builds on the fly from pending http responses
export function createDynamicPolicy(policy: ContentSecurityPolicy) {
    const policyBuilder = new ContentSecurityPolicyBuilder(policy);

    return (body) => {
        return policyBuilder.generateHeaderForHtmlDocument(body);
    };
}

// builds from files on disk
export async function createStaticPolicy(policy: ContentSecurityPolicy) {
    const body = await readFilePromise("");
    const policyBuilder = new ContentSecurityPolicyBuilder(policy);
    return policyBuilder.generateHeaderForHtmlDocument(body.toString());
}