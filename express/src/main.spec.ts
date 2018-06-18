import { Policies } from "cspeasy";
import { createContentSecurityPolicy } from "./main";
import { TestFixture, AsyncTest, Expect, SpyOn } from "alsatian";

@TestFixture("middleware tests")
export class MiddlewareTests {

    @AsyncTest("response header added")
    public async responseHeaderAdded() {
        const fakeResponse = {
            setHeader() {}
        };

        SpyOn(fakeResponse, "setHeader");

        await createContentSecurityPolicy({
            defaultSrc: Policies.None,
            documents: []
        })({} as any, fakeResponse as any, () => {});

        Expect(fakeResponse.setHeader).toHaveBeenCalledWith("Content-Security-Policy", "default-src 'none';");
    }
}
