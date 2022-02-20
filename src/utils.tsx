import { InvalidXMLDocumentFormat } from "./errors";

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
    if (["C", "M"].includes(e)) {
      let nodeBase: PathObjectBase = {
        x: Number(dArray[++i]),
        y: Number(dArray[++i]),
        id: nodeId++,
      };
      if (e === "C") {
        const nodeCData: PathObjectC = {
          ...nodeBase,
          pathType: e,
          x1: Number(dArray[++i]),
          y1: Number(dArray[++i]),
          x2: Number(dArray[++i]),
          y2: Number(dArray[++i]),
        };
        nodesArray.push(nodeCData);
      } else if (e === "M") {
        const nodeMData: PathObjectM = { ...nodeBase, pathType: e };
        nodesArray.push(nodeMData);
      }
    }
  }
  return nodesArray;
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
      const styleObject: ElementStyleProperties = {};
      for (let styleProp of nodeValue.split(";")) {
        const [key, value] = styleProp.split(":");
        if (key === "") continue;
        styleObject[key] = value;
      }
      attributes.style = styleObject;
    } else if (nodeName === "d" && nodeValue) {
      const d = parseDAttribute(nodeValue);
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
  console.log(svgDataObject);
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
    throw new InvalidXMLDocumentFormat(
      "The svg file is not formatted properly!"
    );
  }

  return svgImageElement;
}

export { parseXML, createXMLElement, parseDAttribute };
