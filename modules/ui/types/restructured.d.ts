declare module "restructured" {
  interface RestructuredElement {
    children: RestructuredElement[];
    stringify(): string;
  }

  export function parse(rst: string): RestructuredElement;
}
