import assert from "assert";
import {
  instanceModeParamInit,
  limitParamInit,
  offsetParamInit,
  validateBboxParam,
  validateCrsUri,
  widthUnitsParamInit,
} from "../../src/standards/components/params";
import t from "tap";

t.test("Validate Parsing of CRS param using CRS84.", async (t) => {
  const crs = await validateCrsUri(
    "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
  );
  //console.log(crs);
  t.matchOnly(crs, {
    crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
    //"http://www.opengis.net/def/crs/OGC/1.3/CRS84",
    isGeographic: false,
    //false,
    code: "CRS84",
    //"CRS84",
    srid: 4326,
    //4326,
    version: 1.3,
    // 1.3,
    authority: "OGC",
    //"OGC",
    type: "PlanarCRS",
    // "PlanarCRS",
    wkt: String || null || undefined,
  });
  t.end();
});

t.test(
  "Test Unsuccessful Parsing of CRS param if uri not in crsDetails",
  async (t) => {
    const crs = await validateCrsUri("fc");
    t.notMatch(crs, {
      crs: String,
      //"http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      isGeographic: Boolean,
      //false,
      code: String || Number,
      //"CRS84",
      srid: Number,
      //4326,
      version: Number,
      // 1.3,
      authority: String,
      //"OGC",
      type: String,
      // "PlanarCRS",
      wkt: String || undefined || null,
    });
    t.end();
  }
);

t.test("BBOX param - 4 Item - Planar/Geographic", async (t) => {
  const bboxVals = [-5, -10, 15, 20];
  let crs: URL;
  t.test("Planar", async () => {
    crs = new URL("http://www.opengis.net/def/crs/OGC/1.3/CRS84");
    const bboxToTest = await validateBboxParam(
      //@ts-expect-error
      await validateCrsUri(crs.toString()),
      bboxVals
    );
    t.match(bboxToTest?.xyAxisBbox, Array<Number>);
    //t.notMatch()
    assert.deepEqual(bboxToTest?.xyAxisBbox, [-5, -10, 15, 20]);
    t.match(bboxToTest?.zAxisBbox, undefined);
  });

  t.test("Geographic", async () => {
    crs = new URL("http://www.opengis.net/def/crs/EPSG/0/4326");
    const bboxToTest = await validateBboxParam(
      //@ts-expect-error
      await validateCrsUri(crs.toString()),
      bboxVals
    );
    t.match(bboxToTest?.xyAxisBbox, Array<Number>);
    //t.notMatch()
    assert.deepEqual(bboxToTest?.xyAxisBbox, [-10, -5, 20, 15]);
    t.match(bboxToTest?.zAxisBbox, undefined);
    //assert.deepEqual(bboxToTest?.xyAxisBbox[1], bboxVals[0]);
  });
  t.end();
});

t.test("BBOX param - 6 Item - Planar/Geographic", async (t) => {
  const bboxVals = [-5, -10, 100, 15, 20, 200];

  let crs: URL;

  t.test("Planar", async () => {
    crs = new URL("http://www.opengis.net/def/crs/OGC/1.3/CRS84");
    const bboxToTest = await validateBboxParam(
      //@ts-expect-error
      await validateCrsUri(crs.toString()),
      bboxVals
    );
    t.match(bboxToTest?.xyAxisBbox, Array<Number>);
    //t.notMatch()
    assert.deepEqual(bboxToTest?.xyAxisBbox, [-5, -10, 15, 20]);
    //t.match(bboxToTest?.zAxisBbox, !null || undefined);
    assert.deepEqual(bboxToTest?.zAxisBbox, [bboxVals[2], bboxVals[5]]);
  });
  t.test("Geographic", async () => {
    crs = new URL("http://www.opengis.net/def/crs/EPSG/0/4326");
    const bboxToTest = await validateBboxParam(
      //@ts-expect-error
      await validateCrsUri(crs.toString()),
      bboxVals
    );
    t.match(bboxToTest?.xyAxisBbox, Array<Number>);
    //t.notMatch()
    assert.deepEqual(bboxToTest?.xyAxisBbox, [-10, -5, 20, 15]);
    //t.match(bboxToTest?.zAxisBbox, !null || undefined);
    assert.deepEqual(bboxToTest?.zAxisBbox, [bboxVals[2], bboxVals[5]]);
  });
  t.end();
});

t.test("InstanceMode Default", async (t) => {
  //const instancemode="country"
  t.equal(await instanceModeParamInit("country"), "country");
  t.equal(await instanceModeParamInit(undefined), "subregion");
  t.end();
});

t.test("Offset/Limit Param", async (t) => {
  t.equal(await limitParamInit(0), 0);
  t.equal(await limitParamInit(undefined), 100);
  t.equal(await offsetParamInit(undefined), 0);
  t.equal(await offsetParamInit(0), 0);
});


t.test("*-Units",async(t)=>{
  //Width Units
  t.match(await widthUnitsParamInit(undefined),undefined );
  //t.match(await widthUnitsParamInit("mete"),)

  //Height Units
})