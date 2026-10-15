import { __Base_DocumentSection, Divider_DocumentSection, Text_HeaderLabel } from "./__Base_DocumentSection.tsx";
import { ColumnList_SectionContent, Text_SectionContent } from "./SectionContent_Document.tsx";

export interface Props__LifeSection_Resume {
  lifestyleName: string;
  roleName: string;
  dateRange: string;
  overviewText: string;
  lifeLearnings: string[];
}

export function LifeSection_Resume({
  lifestyleName,
  roleName,
  dateRange,
  overviewText,
  lifeLearnings
}: Props__LifeSection_Resume) {
  return (
    <__Base_DocumentSection
      sectionDivider={<Divider_DocumentSection />}
      accessibilityLabel={`life: ${lifestyleName} - ${roleName}`}
      headerLabels={[
        <Text_HeaderLabel
          key={0}
          label={lifestyleName}
        />,
        <Text_HeaderLabel
          key={1}
          label={roleName}
        />,
        <Text_HeaderLabel
          key={2}
          label={dateRange}
        />
      ]}
      bodyContent={[
        <Text_SectionContent
          key={0}
          accessibilityLabel={`overview: ${lifestyleName} - ${roleName}`}
          contentLabel="overview"
          textContent={overviewText}
        />,
        <ColumnList_SectionContent
          key={1}
          accessibilityLabel={`learnings: ${lifestyleName} - ${roleName}`}
          contentLabel="learnings"
          listItems={lifeLearnings}
        />
      ]}
    />
  );
}
