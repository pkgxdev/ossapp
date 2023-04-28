import { shellOpenExternal } from "@native";

export default function externalLinks(node: HTMLElement): { destroy: () => void } {
  function handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target.tagName === "A" && target.getAttribute("target") === "_blank") {
      event.preventDefault();
      const href = target.getAttribute("href");
      if (href) {
        shellOpenExternal(href);
      }
    }
  }

  node.addEventListener("click", handleClick);

  return {
    destroy() {
      node.removeEventListener("click", handleClick);
    }
  };
}
