/**
 * Lets you run `npx sanity <command>` in this folder (e.g. `npx sanity cors add`).
 * https://www.sanity.io/docs/cli
 */
import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

export default defineCliConfig({ api: { projectId, dataset } });
