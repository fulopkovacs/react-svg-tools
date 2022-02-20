import { InvalidXMLDocumentFormatError } from "./errors";
import { createXMLElement, generateDString, parseXML } from "./utils";

function SvgImage(props: { content: string }) {
  let xmlElement;
  let xmlElementDataObject;

  try {
    xmlElement = props.content && createXMLElement(props.content);
    xmlElementDataObject = xmlElement && parseXML(xmlElement);
  } catch (error) {
    if (error instanceof InvalidXMLDocumentFormatError) {
      console.error("Invalid XMLDocumentFormat");
    } else {
      console.error(error);
    }
  }

  function createElement(elementData: ElementObjectBase) {
    if (elementData.name === "svg") {
      const childrenElements = elementData.children.map((child) =>
        createElement(child)
      );
      return (
        <svg
          style={elementData.attributes.style}
          viewBox={elementData.attributes.viewBox}
          width={elementData.attributes.width}
          height={elementData.attributes.height}
          xmlns={elementData.attributes.xmlns}
        >
          {childrenElements}
        </svg>
      );
    }
    if (elementData.name === "g") {
      const childrenElements = elementData.children.map((child) =>
        createElement(child)
      );
      return <g>{childrenElements}</g>;
    }
    if (elementData.name === "path") {
      return (
        <path
          d={generateDString(elementData.attributes.d)}
          style={elementData.attributes.style}
        />
      );
    }
  }

  return (
    <div>
      <h2>You'll see the svg image below.</h2>
      {xmlElementDataObject && createElement(xmlElementDataObject)}
    </div>
  );
}

export default SvgImage;
