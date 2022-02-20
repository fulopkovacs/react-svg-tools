import { parseXML } from "../utils";

test("Parse a valid string representation of an svg document", () => {
  const parser = new DOMParser();

  const svgImageElement = parser.parseFromString(
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 473 571" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><g id="Bot"><g id="Head"><path d="M153.215,92.4C133.16,105.474 117.289,239.28 128.129,259.147C135.902,273.394 214.839,279.898 257.831,282.697C300.55,285.478 370.809,290.666 386.081,275.942C398.266,264.194 401.935,170.826 391.446,141.985C384.014,121.553 172.456,79.857 153.215,92.4Z" style="fill:none;stroke:#000;stroke-width:14px;"/></g></g></svg>',
    "image/svg+xml"
  );

  const value = parseXML(svgImageElement);
  const expectation = {
    name: "svg",
    attributes: {
      width: "100%",
      height: "100%",
      viewBox: "0 0 473 571",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      "xml:space": "preserve",
      "xmlns:serif": "http://www.serif.com/",
      style: {
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-miterlimit": "1.5",
      },
    },
    children: [
      {
        name: "g",
        attributes: {
          id: "Bot",
        },
        children: [
          {
            name: "g",
            attributes: {
              id: "Head",
            },
            children: [
              {
                name: "path",
                attributes: {
                  d: "M153.215,92.4C133.16,105.474 117.289,239.28 128.129,259.147C135.902,273.394 214.839,279.898 257.831,282.697C300.55,285.478 370.809,290.666 386.081,275.942C398.266,264.194 401.935,170.826 391.446,141.985C384.014,121.553 172.456,79.857 153.215,92.4Z",
                  style: {
                    fill: "none",
                    stroke: "#000",
                    "stroke-width": "14px",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };
  expect(value).toStrictEqual(expectation);
});
