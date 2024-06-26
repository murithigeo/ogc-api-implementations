import { Length } from "convert";
import { ctxParams } from "../../utils";
import t from "tap";

t.test("Conversion of height-units", async (t) => {
  //
  ctxParams.query["height-units"] = "KM";

  //Corridor-height
  t.test("Corridor-height", async () => {
    ctxParams.query["corridor-height"] = 20;
    //t.equal(await corri)
  });
});
