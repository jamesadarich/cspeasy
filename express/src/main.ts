import { ContentSecurityPolicyInfo, ContentSecurityPolicy } from "cspeasy";
import { readFile } from "fs";
import { Request, Response, NextFunction } from "express";

async function readFilePromise(path: string) {
    return new Promise<Buffer>((resolve, reject) => {
        readFile(path, (err, data) => err ? reject(err) : resolve(data));
    });
}

export async function createContentSecurityPolicy(policy: ContentSecurityPolicyInfo & { documents: Array<string> }) {
    let csp = new ContentSecurityPolicy(policy);

    for (let document of policy.documents) {
        const documentBuffer = await readFilePromise(document);
        csp = csp.addDocument(documentBuffer.toString());
    }

    return (request: Request, response: Response, next: NextFunction) => {
        response.setHeader("Content-Security-Policy", csp.getHeaderValue());
        next();
    };
}
