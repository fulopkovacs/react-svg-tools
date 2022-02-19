import { createXMLElement, parseXML } from "./utils";
import { InvalidXMLDocumentFormat } from "./errors";

export function RenderSvgImage(props: { content: string | null }) {
  if (props.content === null) return <div>empty</div>;

  let doc;
  try {
    const xmlElement = createXMLElement(props.content);
    doc = parseXML(xmlElement);
  } catch (error) {
    if (error instanceof InvalidXMLDocumentFormat)
      return <div>{error.message}</div>;
  }
  return <div>{String(doc)}</div>;
}

export { createXMLElement, parseXML };
