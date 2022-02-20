import {
  InvalidXMLDocumentFormatError,
  OnlyAbsoluteCoordinatesError,
} from "./errors";

// TODO:
// This only works for the selected path types and absolute coordinates.
// Make this work with everything else!
function parseDAttribute(d: string) {
  const dArray = d
    .replaceAll(",", " ")
    .replaceAll(/[A-z]/g, " $& ")
    .trim()
    .split(/\s+/);
  let nodesArray = [];
  let nodeId = 0;
  for (let i = 0; i < dArray.length; i++) {
    const e = dArray[i];
    if (["C", "M", "L"].includes(e)) {
      if (e === "C") {
        const node: PathObjectC = {
          x1: Number(dArray[++i]),
          y1: Number(dArray[++i]),
          x2: Number(dArray[++i]),
          y2: Number(dArray[++i]),
          x: Number(dArray[++i]),
          y: Number(dArray[++i]),
          id: nodeId++,
          pathType: e,
        };
        nodesArray.push(node);
      } else if (e === "M" || e == "L") {
        const node: PathObjectM | PathObjectL = {
          x: Number(dArray[++i]),
          y: Number(dArray[++i]),
          id: nodeId++,
          pathType: e,
        };
        nodesArray.push(node);
      }
    } else if (e.match(/[a-z]/)) {
      throw new OnlyAbsoluteCoordinatesError(
        e + "  Relative coordinates are not supported yet!"
      );
    }
  }
  return nodesArray;
}

function generateDString(
  nodeDataArray: Array<PathObjectM | PathObjectC>
): string {
  let dString = "";
  for (let nodeData of nodeDataArray) {
    dString += nodeData.pathType;

    if ("x1" in nodeData)
      dString += nodeData.x1.toString() + " " + nodeData.y1.toString() + " ";
    if ("x2" in nodeData)
      dString += nodeData.x2.toString() + " " + nodeData.y2.toString() + " ";
    if ("x" in nodeData)
      dString += nodeData.x.toString() + " " + nodeData.y.toString() + " ";
  }
  return dString;
}

function convertToCamelCase(name: string) {
  const hyphenName = name.split("-");
  let camelCaseString = hyphenName.shift();
  // TODO: avoid checking the value of `camelCaseString` for `undefined`
  // if it's not necessary
  if (hyphenName.length > 0 && camelCaseString) {
    for (let part of hyphenName) {
      camelCaseString += part.charAt(0).toUpperCase() + part.slice(1);
    }
    return camelCaseString;
  }

  return name;
}

function generateStyleObject(nodeValue: string) {
  const styleObject: ElementStyleProperties = {};
  for (let styleProp of nodeValue.split(";")) {
    const [key, value] = styleProp.split(":");
    if (key === "") continue;
    const keyInCamelCase = convertToCamelCase(key);
    styleObject[keyInCamelCase] = value;
  }
  return styleObject;
}

function parseNode(element: Element): ElementObjectBase {
  /* TODO: Flatten this array to obtain ids that can be used to change the data object that defines  the state of the svg react component
   */
  const base = { name: element.nodeName };
  const attributes: ElementAttributes = {};
  Array.from(element.attributes).forEach(({ nodeName, nodeValue }) => {
    if (!["style", "d"].includes(nodeName)) {
      attributes[nodeName] = nodeValue;
    } else if (nodeName === "style" && nodeValue) {
      const styleObject = generateStyleObject(nodeValue);
      attributes.style = styleObject;
    } else if (nodeName === "d" && nodeValue) {
      const d = parseDAttribute(nodeValue);
      // const d = nodeValue; // TODO; Use the `parseDAttribute` function here later!!!
      attributes.d = d;
    }
  });

  if (element.hasChildNodes()) {
    const children = [];
    for (let child of element.children) {
      children.push(parseNode(child));
    }
    return { ...base, attributes, children };
  } else {
    return { ...base, attributes };
  }
}

function parseXML(xmlElement: XMLDocument) {
  // INFO: At this point it can be safely assumed that the
  // first child element of the xml document is an svg element.
  const svgObject = xmlElement.children[0] as SVGSVGElement;
  const svgDataObject = parseNode(svgObject);
  return svgDataObject;
}

function createXMLElement(xmlElementString: string) {
  const parser = new DOMParser();

  const svgImageElement = parser.parseFromString(
    xmlElementString,
    "image/svg+xml"
  ) as XMLDocument;

  const errorNode = svgImageElement.querySelector("parsererror");

  // INFO: This is how the parsing errors are supposed to be handled
  // see: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#error_handling
  if (errorNode) {
    throw new InvalidXMLDocumentFormatError(
      "The svg file is not formatted properly!"
    );
  }

  return svgImageElement;
}

export {
  parseXML,
  createXMLElement,
  convertToCamelCase,
  parseDAttribute,
  generateDString,
  generateStyleObject,
};
