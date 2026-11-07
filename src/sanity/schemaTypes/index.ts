import { type SchemaTypeDefinition } from "sanity";
import { article } from "./article";
import { blockContent } from "./blockContent";
import { contactMessage } from "./contactMessage";
import { episode } from "./episode";
import { tag } from "./tag";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, episode, tag, contactMessage, blockContent],
};
