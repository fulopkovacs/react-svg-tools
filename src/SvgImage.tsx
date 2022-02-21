import { useEffect, useState } from "react";
import { InvalidXMLDocumentFormatError } from "./errors";
import { createSvgElement, createXMLElement, parseXML } from "./utils";

function SvgImage(props: { content: string }) {
  const [svgElement, setSvgElement] = useState<null | JSX.Element>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const xmlElement = props.content && createXMLElement(props.content);
      const xmlElementDataArray = xmlElement && parseXML(xmlElement);
      setErrorMessage("");
      setSvgElement(
        xmlElementDataArray ? createSvgElement(xmlElementDataArray) : null
      );
    } catch (error) {
      setErrorMessage(String(error));
      setSvgElement(null);
      if (error instanceof InvalidXMLDocumentFormatError) {
        console.error("Invalid XMLDocumentFormat");
      } else {
        console.error(error);
      }
    }
  }, [props.content]);

  return (
    <div>
      {errorMessage ? (
        <h2 style={{ color: "red" }}> {errorMessage} </h2>
      ) : svgElement ? (
        svgElement
      ) : (
        <h2 style={{ color: "blue" }}>Please upload a supported file!</h2>
      )}
    </div>
  );
}

export default SvgImage;
