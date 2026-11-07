import type { StructureResolver } from "sanity/structure";

// Sidebar in the Studio: Articles first, then radio, then tags.
// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Hill Top Hawk")
    .items([
      S.documentTypeListItem("article").title("Articles"),
      S.documentTypeListItem("episode").title("Radio Episodes"),
      S.divider(),
      S.documentTypeListItem("tag").title("Tags"),
      S.divider(),
      // Contact form submissions from the site, newest first.
      S.listItem()
        .title("Messages")
        .schemaType("contactMessage")
        .child(
          S.documentTypeList("contactMessage")
            .title("Messages")
            .defaultOrdering([{ field: "receivedAt", direction: "desc" }])
            .initialValueTemplates([]),
        ),
    ]);
