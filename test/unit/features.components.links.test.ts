import serverInstance from "../helpers";
import t from "tap";
import * as links from "../../src/standards/features/components/links";
import assert from "assert";

t.test(
  "Test that self and alternate link options are done correctly",
  async (t) => {
    let fParam: "json" | "yaml" = "json";
    //t.match(links.genLinksAll())
    t.test("json", async () => {
      const options = await links.filter_f_types(fParam, [
        { f: "json", type: "application/json" },
        { f: "yaml", type: "text/yaml" },
      ]);
      assert.deepEqual(options.optionsForSelf, [
        { f: "json", type: "application/json" },
      ]);
      t.equal(options.optionsForSelf.length, 1);
      t.notMatchStrict(options.optionsForSelf, [
        { f: "yaml", type: "text/yaml" },
      ]);
      assert.deepEqual(options.optionsForSelf, [
        { f: "json", type: "application/json" },
      ]);
      t.equal(options.optionsForSelf.length, 1);
      t.notMatchStrict(options.optionsForSelf, [
        { f: "yaml", type: "text/yaml" },
      ]);
    });

    t.test("yaml", async () => {
        fParam="yaml"
        const options = await links.filter_f_types(fParam, [
          { f: "json", type: "application/json" },
          { f: "yaml", type: "text/yaml" },
        ]);
        assert.deepEqual(options.optionsForSelf, [
          { f: "yaml", type: "text/yaml" },
        ]);
        t.equal(options.optionsForSelf.length, 1);
        t.notMatchStrict(options.optionsForSelf, [
          { f: "json", type: "application/json" },
        ]);
        assert.deepEqual(options.optionsForAlt, [
          { f: "json", type: "application/json" },
        ]);
        t.equal(options.optionsForSelf.length, 1);
        t.notMatchStrict(options.optionsForAlt, [
          { f: "yaml", type: "text/yaml" },
        ]);
      });
      t.end()
  }
);
