import { sumFloat } from "../pos";
jest.unmock("../pos");
describe("Point Of Sale utils", () => {
    it("adds 1 + 2 to equal 3 in TScript", () => {
        expect(sumFloat(1, 2)).toBe(3);
    });
});
//# sourceMappingURL=pos.test.js.map