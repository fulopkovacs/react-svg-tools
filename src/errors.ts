class InvalidXMLDocumentFormat extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidXMLDocumentFormat";
  }
}

export { InvalidXMLDocumentFormat };
