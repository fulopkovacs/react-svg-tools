import React from "react";
import {
  InvalidXMLDocumentFormatError,
  OnlyAbsoluteCoordinatesError,
  UnsupportedTagError,
} from "./errors";

const attributeBlackList = ["xmlns:serif"];

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
        "Relative coordinates are not supported yet!"
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

function convertToCamelCase(name: string, separator: string) {
  const originalName = name.split(separator);
  let camelCaseString = originalName.shift();
  // TODO: avoid checking the value of `camelCaseString` for `undefined`
  // if it's not necessary
  if (originalName.length > 0 && camelCaseString) {
    for (let part of originalName) {
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
    const keyInCamelCase = convertToCamelCase(key, "-");
    styleObject[keyInCamelCase] = value;
  }
  return styleObject;
}

function getElementData(element: Element): ElementObjectBase[] {
  // const svgDataObject: { [key: string]: ElementObjectBase } = {};
  const svgDataArray: ElementObjectBase[] = [];
  let id = -1;

  function parseElement(element: Element, parentId = -1) {
    /* TODO: Flatten this array to obtain ids that can be used to change the data object that defines  the state of the svg react component
     */
    const base = { name: element.nodeName };
    const attributes: ElementAttributes = {};
    const currentId = ++id;
    Array.from(element.attributes).forEach(({ nodeName, nodeValue }) => {
      if (!["style", "d", ...attributeBlackList].includes(nodeName)) {
        attributes[convertToCamelCase(nodeName, ":")] = nodeValue;
      } else if (nodeName === "style" && nodeValue) {
        const styleObject = generateStyleObject(nodeValue);
        attributes.style = styleObject;
      } else if (nodeName === "d" && nodeValue) {
        const d = parseDAttribute(nodeValue);
        attributes.d = d;
      }
    });

    if (element.hasChildNodes()) {
      const children: number[] = [];
      for (let child of element.children) {
        parseElement(child, currentId);
      }
      svgDataArray[currentId] = {
        ...base,
        attributes,
        children,
        parentId,
      };
    } else {
      svgDataArray[currentId] = { ...base, attributes, parentId };
    }
  }

  parseElement(element);

  svgDataArray.forEach((element, i) => {
    if (
      element.parentId >= 0 &&
      element.parentId in svgDataArray &&
      "children" in svgDataArray[element.parentId]
    ) {
      // INFO: The non-null assertion operator can be used here safely, since `children` will always be an empty array if it exists.
      svgDataArray[element.parentId].children!.push(i);
    }
  });

  return svgDataArray;
}

function createSvgElement(elements: ElementObjectBase[]) {
  const ids = elements.map((_, i) => i);
  const visited_ids: number[] = [];
  // TODO: Do not sort the array in place, create a new `sortedElements` variable for it instead!
  elements.sort((e1, e2) => (e1.parentId > e2.parentId ? 1 : -1));

  function generateElement(id: number) {
    // 1. generate Children
    const element = elements[id];
    visited_ids.push(id);
    let children: JSX.Element[] | null = null;
    if (element.children) {
      children = element.children.map((childIndex) =>
        generateElement(childIndex)
      );
    }
    if (element.name === "svg") {
      // if (!children) return React.createElement("svg", element.attributes);

      const svg: JSX.Element = React.createElement(
        element.name,
        element.attributes,
        children
      );
      return svg;
    } else if (element.name === "g") {
      const g: JSX.Element = React.createElement(
        element.name,
        { key: id, ...element.attributes },
        children
      );
      return g;
    } else if (element.name === "path") {
      const pathAttributes = element.attributes;
      if (pathAttributes && "d" in pathAttributes) {
        // TODO: Make sure that the pathAttributes.d is always an array of path element data objects
        const dObj = pathAttributes.d as unknown as Array<
          PathObjectC | PathObjectM
        >;
        pathAttributes.d = generateDString(dObj);
      }
      const path: JSX.Element = React.createElement(
        element.name,
        { key: id, ...pathAttributes },
        children
      );
      return path;
    } else {
      throw new UnsupportedTagError(
        `This tag is not supported yet: ${element.name}`
      );
    }
  }

  // TODO: Make sure that every element is created!
  return generateElement(ids[0]);
}

function parseXML(xmlElement: XMLDocument) {
  // INFO: At this point it can be safely assumed that the
  // first child element of the xml document is an svg element.
  const svgObject = xmlElement.children[0] as SVGSVGElement;
  return getElementData(svgObject);
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
  createSvgElement,
  convertToCamelCase,
  parseDAttribute,
  generateDString,
  generateStyleObject,
  getElementData,
};
