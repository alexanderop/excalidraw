import { pointFrom } from "@excalidraw/math";

import { arrayToMap, ROUNDNESS } from "@excalidraw/common";

import type { LocalPoint } from "@excalidraw/math";

import { getElementAbsoluteCoords, getElementBounds } from "../src/bounds";

import type { ExcalidrawElement, ExcalidrawLinearElement } from "../src/types";

const _ce = ({
  x,
  y,
  w,
  h,
  a,
  t,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  a?: number;
  t?: string;
}) =>
  ({
    type: t || "rectangle",
    strokeColor: "#000",
    backgroundColor: "#000",
    fillStyle: "solid",
    strokeWidth: 1,
    roundness: { type: ROUNDNESS.PROPORTIONAL_RADIUS },
    roughness: 0,
    opacity: 1,
    x,
    y,
    width: w,
    height: h,
    angle: a,
  } as ExcalidrawElement);

describe("getElementAbsoluteCoords", () => {
  it("test x1 coordinate", () => {
    const element = _ce({ x: 10, y: 20, w: 10, h: 0 });
    const [x1] = getElementAbsoluteCoords(element, arrayToMap([element]));
    expect(x1).toEqual(10);
  });

  it("test x2 coordinate", () => {
    const element = _ce({ x: 10, y: 20, w: 10, h: 0 });
    const x2 = getElementAbsoluteCoords(element, arrayToMap([element]))[2];
    expect(x2).toEqual(20);
  });

  it("test y1 coordinate", () => {
    const element = _ce({ x: 0, y: 10, w: 0, h: 10 });
    const [, y1] = getElementAbsoluteCoords(element, arrayToMap([element]));
    expect(y1).toEqual(10);
  });

  it("test y2 coordinate", () => {
    const element = _ce({ x: 0, y: 10, w: 0, h: 10 });
    const y2 = getElementAbsoluteCoords(element, arrayToMap([element]))[3];
    expect(y2).toEqual(20);
  });
});

describe("getElementBounds", () => {
  it("rectangle", () => {
    const element = _ce({
      x: 40,
      y: 30,
      w: 20,
      h: 10,
      a: Math.PI / 4,
      t: "rectangle",
    });
    const [x1, y1, x2, y2] = getElementBounds(element, arrayToMap([element]));
    expect(x1).toEqual(39.393_398_282_201_79);
    expect(y1).toEqual(24.393_398_282_201_787);
    expect(x2).toEqual(60.606_601_717_798_21);
    expect(y2).toEqual(45.606_601_717_798_21);
  });

  it("diamond", () => {
    const element = _ce({
      x: 40,
      y: 30,
      w: 20,
      h: 10,
      a: Math.PI / 4,
      t: "diamond",
    });

    const [x1, y1, x2, y2] = getElementBounds(element, arrayToMap([element]));

    expect(x1).toEqual(42.928_932_188_134_524);
    expect(y1).toEqual(27.928_932_188_134_524);
    expect(x2).toEqual(57.071_067_811_865_476);
    expect(y2).toEqual(42.071_067_811_865_476);
  });

  it("ellipse", () => {
    const element = _ce({
      x: 40,
      y: 30,
      w: 20,
      h: 10,
      a: Math.PI / 4,
      t: "ellipse",
    });

    const [x1, y1, x2, y2] = getElementBounds(element, arrayToMap([element]));
    expect(x1).toEqual(42.094_305_849_579_05);
    expect(y1).toEqual(27.094_305_849_579_05);
    expect(x2).toEqual(57.905_694_150_420_95);
    expect(y2).toEqual(42.905_694_150_420_95);
  });

  it("curved line", () => {
    const element = {
      ..._ce({
        t: "line",
        x: 449.582_031_25,
        y: 186.0625,
        w: 170.128_906_25,
        h: 92.488_281_25,
        a: 0.644_774_190_493_241_6,
      }),
      points: [
        pointFrom<LocalPoint>(0, 0),
        pointFrom<LocalPoint>(67.339_843_75, 92.488_281_25),
        pointFrom<LocalPoint>(-102.789_062_5, 52.156_25),
      ],
    } as ExcalidrawLinearElement;

    const [x1, y1, x2, y2] = getElementBounds(element, arrayToMap([element]));
    expect(x1).toEqual(360.929_101_752_516_5);
    expect(y1).toEqual(185.247_701_293_437_22);
    expect(x2).toEqual(481.481_553_903_760_1);
    expect(y2).toEqual(319.816_285_582_724_6);
  });
});
