interface ElementStyleProperties {
  [key: string]: string | number;
}

interface ElementAttributes {
  [key: string]: string | null | ElementStyleProperties;
}

interface ElementObjectBase {
  name: string;
  attributes: ElementAttributes;
  children?: ElementObjectBase[];
}

interface PathElementObject extends ElementObjectBase {
  x: number;
  y: number;
}

interface PathElementObjectC extends PathElementObject {
  pathType: `C`;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface PathElementObjectM extends ElementObjectBase {
  pathType: `M`;
}
