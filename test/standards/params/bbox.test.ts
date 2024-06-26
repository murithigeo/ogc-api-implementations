import assert from "assert";
import { validateBboxParam } from "../../../src/standards/components/params";
import { ctxParams } from "../../utils";
import t from "tap";

t.test("Correct parsing of bbox param", async (t) => {
  t.test("4-Item", async () => {
    ctxParams.query.bbox = [-5, -10, 15, 20];
    t.test("PlanarCRS", async () => {
      ctxParams.query["bbox-crs"] =
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
      const res = await validateBboxParam(ctxParams);

      t.match(
        res?.xyAxisBbox,
        Array<Number>,
        ...["base bbox array should be number[]"]
      );
      assert.deepEqual(
        res?.xyAxisBbox,
        ctxParams.query.bbox
        //...[`res should be equal to bbox param`]
      );
      t.match(
        res?.zAxisBbox,
        undefined,
        ...["Since its a 4-Item Array, height Vals should be undefined"]
      );
    });
    t.test("GeographicCRS", async () => {
      ctxParams.query["bbox-crs"] =
        "http://www.opengis.net/def/crs/EPSG/0/4326";

      const res = await validateBboxParam(ctxParams);

      t.match(
        res?.xyAxisBbox,
        Array<Number>
        //  ...["base bbox array should be number[]"]
      );
      assert.deepEqual(
        res?.xyAxisBbox,
        [
          ctxParams.query.bbox[1],
          ctxParams.query.bbox[0],
          ctxParams.query.bbox[3],
          ctxParams.query.bbox[2],
        ]
        //...[`res should be equal to bbox param`]
      );
      t.match(
        res?.zAxisBbox,
        undefined,
        ...["Since its a 4-Item Array, height Vals should be undefined"]
      );
    });
  });

  t.test("6-Item", async () => {
    ctxParams.query.bbox = [-5, -10, 100, 15, 20, 200];

    t.test("PlanarCRS", async () => {
      ctxParams.query["bbox-crs"] =
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
      const res = await validateBboxParam(ctxParams);

      t.match(
        res?.xyAxisBbox,
        Array<Number>
        //  ...["res should be number[]"]
      );

      assert.deepEqual(
        res?.xyAxisBbox,
        [
          ctxParams.query.bbox[0],
          ctxParams.query.bbox[1],
          ctxParams.query.bbox[3],
          ctxParams.query.bbox[4],
        ]
        //"x,y values are extracted correctly"
      );

      assert.deepEqual(
        res?.zAxisBbox,
        [ctxParams.query.bbox[2], ctxParams.query.bbox[5]],
        "z values are extracted correctly"
      );
    });

    t.test("GeographicCRS", async () => {
      ctxParams.query["bbox-crs"] =
        "http://www.opengis.net/def/crs/EPSG/0/4326";
      const res = await validateBboxParam(ctxParams);

      t.match(
        res?.xyAxisBbox,
        Array<Number>
        //...["res should be number[]"]);
      );
      assert.deepEqual(
        res?.xyAxisBbox,
        [
          ctxParams.query.bbox[1],
          ctxParams.query.bbox[0],
          ctxParams.query.bbox[4],
          ctxParams.query.bbox[3],
        ]
        //"x,y values are extracted correctly"
      );

      assert.deepEqual(
        res?.zAxisBbox,
        [ctxParams.query.bbox[2], ctxParams.query.bbox[5]],
        "z values are extracted correctly"
      );
    });
  });

  t.test(
    "Undefined bbox-crs parameter scenario: CRS84 is used as default",
    async () => {
      ctxParams.query["bbox-crs"] = undefined;
      ctxParams.query.bbox = [-5, -10, 100, 15, 20, 200];

      assert.deepEqual((await validateBboxParam(ctxParams))?.xyAxisBbox, [
        ctxParams.query.bbox[0],
        ctxParams.query.bbox[1],
        ctxParams.query.bbox[3],
        ctxParams.query.bbox[4],
      ]);
    }
  );
  t.end();
});
