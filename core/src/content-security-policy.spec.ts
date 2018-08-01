import { AsyncTest, Expect, Test, TestCase, TestFixture } from "alsatian";

@TestFixture("whatever you'd like to call the fixture")
export class SetOfTests {
    @TestCase(3, 3, 6)
    @TestCase(3, 3, 7)
    @Test("addition tests")
    public addTest(firstNumber: number, secondNumber: number, expectedSum: number) {
        Expect(firstNumber + secondNumber).toBe(expectedSum);
    }
}