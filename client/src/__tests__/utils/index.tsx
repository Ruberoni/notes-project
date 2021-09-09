import { getHideScrollBarCSS } from "../../utils";

describe.only("utils", () => {
  describe("getHideScrollBarCSS", () => {
    type NormalCSSObject = Record<string, string | number>;

    it("Without args, should have 'overflow' prop", () => {
      // act
      const cssStyles = getHideScrollBarCSS() as NormalCSSObject;
      // assert
      expect(cssStyles).toHaveProperty([".delHScrollBar"]);
      expect(cssStyles[".delHScrollBar"]).toHaveProperty("overflow");
    });
    it("Without arg 'x', should have 'overflow-x' prop", () => {
      // act
      const cssStyles = getHideScrollBarCSS("x") as NormalCSSObject;
      // assert
      expect(cssStyles).toHaveProperty([".delHScrollBar"]);
      expect(cssStyles[".delHScrollBar"]).toHaveProperty("overflow-x");
    });
    it("Without arg 'y', should have 'overflow-y' prop", () => {
      // act
      const cssStyles = getHideScrollBarCSS("y") as NormalCSSObject;
      // assert
      expect(cssStyles).toHaveProperty([".delHScrollBar"]);
      expect(cssStyles[".delHScrollBar"]).toHaveProperty("overflow-y");
    });
  });
});
