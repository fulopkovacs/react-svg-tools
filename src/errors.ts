class InvalidXMLDocumentFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidXMLDocumentFormat";
  }
}

class OnlyAbsoluteCoordinatesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OnlyAbsoluteCoordinates";
  }
}

export { InvalidXMLDocumentFormatError, OnlyAbsoluteCoordinatesError };
