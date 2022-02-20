interface ElementStyleProperties {
  [key: string]: string | number;
}

interface ElementAttributes {
  [key: string]:
    | string
    | null
    | ElementStyleProperties
    | Array<PathObjectC | PathObjectM>; // TODO: This array is only suitable for the `d` attribute of the `path` element. Fix it later!
}

interface ElementObjectBase {
  name: string;
  attributes: ElementAttributes;
  children?: ElementObjectBase[];
}

interface PathObjectBase {
  id: number;
  x: number;
  y: number;
}

interface PathObjectC extends PathObjectBase {
  pathType: `C`;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface PathObjectM extends PathObjectBase {
  pathType: `M`;
}
