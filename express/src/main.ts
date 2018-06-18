import { ContentSecurityPolicyInfo, ContentSecurityPolicy } from "cspeasy";
import { readFile } from "fs";
import { Request, Response, NextFunction } from "express";

async function readFileAsync(path: string) {
    return new Promise<Buffer>((resolve, reject) => {
        readFile(path, (err, data) => err ? reject(err) : resolve(data));
    });
}

export function createContentSecurityPolicy(policy: ContentSecurityPolicyInfo & { documents: Array<string> }) {
    let csp = getCsp(policy);

    return async (request: Request, response: Response, next: NextFunction) => {
        response.setHeader("Content-Security-Policy", (await csp).getHeaderValue());
        next();
    };
}

async function getCsp(policy: ContentSecurityPolicyInfo & { documents: Array<string> }) {
    let csp = new ContentSecurityPolicy(policy);

    for (let document of policy.documents) {
        const documentBuffer = await readFileAsync(document);
        csp = csp.addDocument(documentBuffer.toString());
    }

    return csp;
}
