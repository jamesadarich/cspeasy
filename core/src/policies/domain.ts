export function Domain(domainName: string) {
    if (/^(https?:\/\/)?((((([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9])|\*)\.)+([a-zA-Z]{2,}|\*))|\*|((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))(:[1-9][0-9]*)?$/.test(domainName) === false ) {
        throw new Error(`${domainName} doesn't seem to be a valid domain name.`);
    }

    return domainName;
}
