import { InvalidXMLDocumentFormat } from "./errors";

function parseNode(element: Element): ElementObjectBase {
  const base = { name: element.nodeName };
  // const attributes = Array.from(node.attributes).map(
  //   ({ nodeName, nodeValue }) =>
  //     nodeName !== "d" && { name: nodeName, value: nodeValue }
  // );
  const attributes: ElementAttributes = {};
  Array.from(element.attributes).forEach(({ nodeName, nodeValue }) => {
    if (nodeName !== "style") {
      attributes[nodeName] = nodeValue;
    } else if (nodeName === "style" && nodeValue) {
      const styleObject: ElementStyleProperties = {};
      for (let styleProp of nodeValue.split(";")) {
        const [key, value] = styleProp.split(":");
        styleObject[key] = value;
      }
      attributes.style = styleObject;
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
  return { children: null };
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

export { parseXML, createXMLElement };
