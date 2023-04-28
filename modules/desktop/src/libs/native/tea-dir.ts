// import { app } from 'electron';
// import fs from 'fs';
// import { join } from 'upath';

type Dir = {
  name: string;
  path: string;
  children?: Dir[];
};

const semverTest =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/g;

export const getPkgBottles = (packageDir: Dir): string[] => {
  const bottles: string[] = [];

  const pkg = packageDir.path.split(".tea/")[1];
  const version = pkg.split("/v")[1];

  const isVersion = semverTest.test(version) || !isNaN(+version) || version === "*";

  if (version && isVersion) {
    bottles.push(pkg);
  } else if (packageDir?.children?.length) {
    const childBottles = packageDir.children
      .map(getPkgBottles)
      .reduce((arr, bottles) => [...arr, ...bottles], []);
    bottles.push(...childBottles);
  }

  return bottles.filter((b) => b !== undefined).sort(); // ie: ["gohugo.io/v*", "gohugo.io/v0", "gohugo.io/v0.108", "gohugo.io/v0.108.0"]
};
