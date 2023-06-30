import { hooks } from "@teaxyz/lib";

// Fetches the details for a package from the local pantry
export async function getPantryDetails(full_name: string) {
  const packageYml = await hooks.usePantry().project(full_name).yaml();
  const { ["display-name"]: display_name, entrypoint, provides } = packageYml;
  return { display_name, entrypoint, provides };
}
