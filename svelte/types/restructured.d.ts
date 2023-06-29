declare module "restructured" {
  interface RestructuredElement {
    children: RestructuredElement[];
    stringify(): string;
    type: string;
  }

  export function parse(rst: string): RestructuredElement;
}
