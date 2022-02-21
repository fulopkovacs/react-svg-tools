import {
  convertToCamelCase,
  generateDString,
  generateStyleObject,
  getElementData,
  parseDAttribute,
  parseXML,
} from "../utils";

test("Parse a  valid d attribute of a path properly", () => {
  const d =
    "M153.215,92.4C133.16,105.474 117.289,239.28 128.129,259.147C135.902,273.394 214.839,279.898 257.831,282.697C300.55,285.478 370.809,290.666 386.081,275.942C398.266,264.194 401.935,170.826 391.446,141.985C384.014,121.553 172.456,79.857 153.215,92.4Z";

  const value = parseDAttribute(d);
  const expectation = [
    {
      id: 0,
      pathType: "M",
      x: 153.215,
      y: 92.4,
    },
    {
      id: 1,
      pathType: "C",
      x: 128.129,
      x1: 133.16,
      x2: 117.289,
      y: 259.147,
      y1: 105.474,
      y2: 239.28,
    },
    {
      id: 2,
      pathType: "C",
      x: 257.831,
      x1: 135.902,
      x2: 214.839,
      y: 282.697,
      y1: 273.394,
      y2: 279.898,
    },
    {
      id: 3,
      pathType: "C",
      x: 386.081,
      x1: 300.55,
      x2: 370.809,
      y: 275.942,
      y1: 285.478,
      y2: 290.666,
    },
    {
      id: 4,
      pathType: "C",
      x: 391.446,
      x1: 398.266,
      x2: 401.935,
      y: 141.985,
      y1: 264.194,
      y2: 170.826,
    },
    {
      id: 5,
      pathType: "C",
      x: 153.215,
      x1: 384.014,
      x2: 172.456,
      y: 92.4,
      y1: 121.553,
      y2: 79.857,
    },
  ];

  expect(value).toStrictEqual(expectation);
});

test("Convert a dObject to string", () => {
  const source: Array<PathObjectM | PathObjectC> = [
    {
      id: 0,
      pathType: "M",
      x: 153.215,
      y: 92.4,
    },
    {
      id: 1,
      pathType: "C",
      x: 128.129,
      x1: 133.16,
      x2: 117.289,
      y: 259.147,
      y1: 105.474,
      y2: 239.28,
    },
    {
      id: 2,
      pathType: "C",
      x: 257.831,
      x1: 135.902,
      x2: 214.839,
      y: 282.697,
      y1: 273.394,
      y2: 279.898,
    },
    {
      id: 3,
      pathType: "C",
      x: 386.081,
      x1: 300.55,
      x2: 370.809,
      y: 275.942,
      y1: 285.478,
      y2: 290.666,
    },
    {
      id: 4,
      pathType: "C",
      x: 391.446,
      x1: 398.266,
      x2: 401.935,
      y: 141.985,
      y1: 264.194,
      y2: 170.826,
    },
    {
      id: 5,
      pathType: "C",
      x: 153.215,
      x1: 384.014,
      x2: 172.456,
      y: 92.4,
      y1: 121.553,
      y2: 79.857,
    },
  ];
  const expectation =
    "M153.215 92.4 C133.16 105.474 117.289 239.28 128.129 259.147 C135.902 273.394 214.839 279.898 257.831 282.697 C300.55 285.478 370.809 290.666 386.081 275.942 C398.266 264.194 401.935 170.826 391.446 141.985 C384.014 121.553 172.456 79.857 153.215 92.4 ";

  expect(generateDString(source)).toStrictEqual(expectation);
});

test("Parse a valid string representation of an svg document and build an elements array based on it", () => {
  const parser = new DOMParser();

  const svgImageElement = parser.parseFromString(
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 473 571" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><g id="Bot"><g id="Head"><path d="M153.215,92.4C133.16,105.474 117.289,239.28 128.129,259.147C135.902,273.394 214.839,279.898 257.831,282.697C300.55,285.478 370.809,290.666 386.081,275.942C398.266,264.194 401.935,170.826 391.446,141.985C384.014,121.553 172.456,79.857 153.215,92.4Z" style="fill:none;stroke:#000;stroke-width:14px;"/></g></g></svg>',
    "image/svg+xml"
  );

  const value = parseXML(svgImageElement);
  const expectation = [
    {
      attributes: {
        height: "100%",
        style: {
          clipRule: "evenodd",
          fillRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: "1.5",
        },
        version: "1.1",
        viewBox: "0 0 473 571",
        width: "100%",
        xmlSpace: "preserve",
        xmlns: "http://www.w3.org/2000/svg",
        xmlnsXlink: "http://www.w3.org/1999/xlink",
      },
      children: [1],
      name: "svg",
      parentId: -1,
    },
    { attributes: { id: "Bot" }, children: [2], name: "g", parentId: 0 },
    { attributes: { id: "Head" }, children: [3], name: "g", parentId: 1 },
    {
      attributes: {
        d: [
          { id: 0, pathType: "M", x: 153.215, y: 92.4 },
          {
            id: 1,
            pathType: "C",
            x: 128.129,
            x1: 133.16,
            x2: 117.289,
            y: 259.147,
            y1: 105.474,
            y2: 239.28,
          },
          {
            id: 2,
            pathType: "C",
            x: 257.831,
            x1: 135.902,
            x2: 214.839,
            y: 282.697,
            y1: 273.394,
            y2: 279.898,
          },
          {
            id: 3,
            pathType: "C",
            x: 386.081,
            x1: 300.55,
            x2: 370.809,
            y: 275.942,
            y1: 285.478,
            y2: 290.666,
          },
          {
            id: 4,
            pathType: "C",
            x: 391.446,
            x1: 398.266,
            x2: 401.935,
            y: 141.985,
            y1: 264.194,
            y2: 170.826,
          },
          {
            id: 5,
            pathType: "C",
            x: 153.215,
            x1: 384.014,
            x2: 172.456,
            y: 92.4,
            y1: 121.553,
            y2: 79.857,
          },
        ],
        style: { fill: "none", stroke: "#000", strokeWidth: "14px" },
      },
      name: "path",
      parentId: 2,
    },
  ];
  expect(value).toStrictEqual(expectation);
});

test("Generate a data array representation from an svg image element", () => {
  const parser = new DOMParser();

  const xmlElement = parser.parseFromString(
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 473 571" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><g id="Bot"><g id="Head"><path d="M153.215,92.4C133.16,105.474 117.289,239.28 128.129,259.147C135.902,273.394 214.839,279.898 257.831,282.697C300.55,285.478 370.809,290.666 386.081,275.942C398.266,264.194 401.935,170.826 391.446,141.985C384.014,121.553 172.456,79.857 153.215,92.4Z" style="fill:none;stroke:#000;stroke-width:14px;"/><path id="Eye_left" d="M170.238,165.438C170.238,165.438 184.253,158.41 191.171,143.133C195.278,157.887 208.038,173.837 208.038,173.837" style="fill:none;stroke:#000;stroke-width:14px;"/></g></g></svg>',
    "image/svg+xml"
  );
  const svgImageElement = xmlElement.children[0] as SVGSVGElement;

  const expectation = [
    {
      attributes: {
        height: "100%",
        style: {
          clipRule: "evenodd",
          fillRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: "1.5",
        },
        version: "1.1",
        viewBox: "0 0 473 571",
        width: "100%",
        xmlSpace: "preserve",
        xmlns: "http://www.w3.org/2000/svg",
        xmlnsXlink: "http://www.w3.org/1999/xlink",
      },
      children: [1],
      name: "svg",
      parentId: -1,
    },
    {
      attributes: {
        id: "Bot",
      },
      children: [2],
      name: "g",
      parentId: 0,
    },
    {
      attributes: {
        id: "Head",
      },
      children: [3, 4],
      name: "g",
      parentId: 1,
    },
    {
      attributes: {
        d: [
          {
            id: 0,
            pathType: "M",
            x: 153.215,
            y: 92.4,
          },
          {
            id: 1,
            pathType: "C",
            x: 128.129,
            x1: 133.16,
            x2: 117.289,
            y: 259.147,
            y1: 105.474,
            y2: 239.28,
          },
          {
            id: 2,
            pathType: "C",
            x: 257.831,
            x1: 135.902,
            x2: 214.839,
            y: 282.697,
            y1: 273.394,
            y2: 279.898,
          },
          {
            id: 3,
            pathType: "C",
            x: 386.081,
            x1: 300.55,
            x2: 370.809,
            y: 275.942,
            y1: 285.478,
            y2: 290.666,
          },
          {
            id: 4,
            pathType: "C",
            x: 391.446,
            x1: 398.266,
            x2: 401.935,
            y: 141.985,
            y1: 264.194,
            y2: 170.826,
          },
          {
            id: 5,
            pathType: "C",
            x: 153.215,
            x1: 384.014,
            x2: 172.456,
            y: 92.4,
            y1: 121.553,
            y2: 79.857,
          },
        ],
        style: {
          fill: "none",
          stroke: "#000",
          strokeWidth: "14px",
        },
      },
      name: "path",
      parentId: 2,
    },
    {
      name: "path",
      attributes: {
        id: "Eye_left",
        d: [
          {
            x: 170.238,
            y: 165.438,
            id: 0,
            pathType: "M",
          },
          {
            x1: 170.238,
            y1: 165.438,
            x2: 184.253,
            y2: 158.41,
            x: 191.171,
            y: 143.133,
            id: 1,
            pathType: "C",
          },
          {
            x1: 195.278,
            y1: 157.887,
            x2: 208.038,
            y2: 173.837,
            x: 208.038,
            y: 173.837,
            id: 2,
            pathType: "C",
          },
        ],
        style: {
          fill: "none",
          stroke: "#000",
          strokeWidth: "14px",
        },
      },
      parentId: 2,
    },
  ];

  expect(getElementData(svgImageElement)).toStrictEqual(expectation);
});

test("Convert strings to camelCase", () => {
  const rawString = {
    hyphen: ["stroke-width", "fill-rule", "width"],
    colon: ["xmlns:xlink", "xml:space"],
  };

  const expectedString = {
    hyphen: ["strokeWidth", "fillRule", "width"],
    colon: ["xmlnsXlink", "xmlSpace"],
  };

  expect(rawString.hyphen.map((s) => convertToCamelCase(s, "-"))).toStrictEqual(
    expectedString.hyphen
  );

  expect(rawString.colon.map((s) => convertToCamelCase(s, ":"))).toStrictEqual(
    expectedString.colon
  );
});

test("Generate style object from string", () => {
  const raw =
    "fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;";

  const styleObj = {
    clipRule: "evenodd",
    fillRule: "evenodd",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "1.5",
  };
  expect(generateStyleObject(raw)).toStrictEqual(styleObj);
});
