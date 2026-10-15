import { __Base_DocumentSection, Divider_DocumentSection, Text_HeaderLabel } from "./__Base_DocumentSection.tsx";
import { ColumnList_SectionContent, Temporal__ListItem_Column } from "./SectionContent_Document.tsx";

export interface Props__InstitutionSection_Resume {
  lifestyleName: string;
  roleName: string;
  facilityStays: Array<{
    facilityName: string;
    stayLength: string;
    dateRange: string;
  }>;
  lifeLearnings: string[];
}

export function InstitutionSection_Resume({
  lifestyleName,
  roleName,
  facilityStays,
  lifeLearnings
}: Props__InstitutionSection_Resume) {
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
        />
      ]}
      bodyContent={[
        <ColumnList_SectionContent
          key={0}
          accessibilityLabel={`stays: ${lifestyleName} - ${roleName}`}
          contentLabel="stays"
          listItems={facilityStays.map((someStay) => (
            <Temporal__ListItem_Column
              itemName={someStay.facilityName}
              itemDetail={someStay.stayLength}
              dateRange={someStay.dateRange}
            />
          ))}
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
