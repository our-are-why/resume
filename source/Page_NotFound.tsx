import { __Base_DocumentSection, Text_HeaderLabel } from "./__Base_DocumentSection.tsx";
import { Text_SectionContent } from "./SectionContent_Document.tsx";
import { NavigationFooter_Document } from "./NavigationFooter_Document.tsx";
import { Unlisted_PageDocument } from "./PageDocument.tsx";

export function Page_NotFound() {
  return (
    <Unlisted_PageDocument
      tabTitle_page="404 - resume - jared mathews"
      description_page="nothing here"
      accessibilityLabel="page not found"
      rootPath_site="/"
    >
      <__Base_DocumentSection
        sectionDivider={null}
        accessibilityLabel="page not found"
        headerLabels={[
          <Text_HeaderLabel
            key={0}
            label="404"
          />
        ]}
        bodyContent={[
          <Text_SectionContent
            key={0}
            accessibilityLabel="page not found: details"
            contentLabel="not found"
            textContent="nothing here but trash"
          />
        ]}
      />
      <NavigationFooter_Document
        routeLinks={[
          {
            routeName: "resume",
            routeHref: "/",
            accessibilityLabel: "resume",
          },
        ]}
        pdfLink={null}
      />
    </Unlisted_PageDocument>
  );
}
