import { __Base_DocumentSection, Divider_DocumentSection, Text_HeaderLabel } from "./__Base_DocumentSection.tsx";
import { ColumnList_SectionContent, Text_SectionContent, WrapList_SectionContent } from "./SectionContent_Document.tsx";

export interface Props__JobSection_Resume {
  companyName: string;
  teamName: string;
  jobTitle: string;
  dateRange: string;
  productDescription: string;
  workResponsibilities: string[];
  techStack: string[];
}

export function JobSection_Resume({
  companyName,
  jobTitle,
  teamName,
  dateRange,
  productDescription,
  workResponsibilities,
  techStack
}: Props__JobSection_Resume) {
  return (
    <__Base_DocumentSection
      sectionDivider={<Divider_DocumentSection />}
      accessibilityLabel={`job: ${companyName} - ${jobTitle}`}
      headerLabels={[
        <Text_HeaderLabel 
          key={0}
          label={companyName}
        />,
        <Text_HeaderLabel 
          key={1}
          label={teamName}
        />,
        <Text_HeaderLabel 
          key={2}
          label={jobTitle}
        />,
        <Text_HeaderLabel 
          key={3}
          label={dateRange}
        />
      ]}
      bodyContent={[
        <Text_SectionContent
          key={0}
          accessibilityLabel={`product description: ${companyName} - ${jobTitle}`}
          contentLabel="product"
          textContent={productDescription}
        />,
        <ColumnList_SectionContent
          key={1}
          accessibilityLabel={`job responsibilities: ${companyName} - ${jobTitle}`}
          contentLabel="responsibilities"
          listItems={workResponsibilities}
        />,
        <WrapList_SectionContent
          key={2}
          accessibilityLabel={`technology used: ${companyName} - ${jobTitle}`}
          contentLabel="tech"
          listItems={techStack}
        />
      ]}
    />
  );
}