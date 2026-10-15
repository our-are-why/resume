import { __Base_DocumentSection, Link_HeaderLabel, Text_HeaderLabel } from "./__Base_DocumentSection.tsx";
import { Text_SectionContent } from "./SectionContent_Document.tsx";

export interface Props__HeaderSection_Resume {
  fullName: string;
  personDescriptors: string[];
  emailAddress: string;
  briefText: string;
  statusText: string;
  shortTerm_goalText: string;
  longTerm_goalText: string;
}

export function HeaderSection_Resume({
  fullName,
  personDescriptors,
  emailAddress,
  briefText,
  statusText,
  shortTerm_goalText,
  longTerm_goalText
}: Props__HeaderSection_Resume) {
  return (
    <__Base_DocumentSection
      sectionDivider={null}
      accessibilityLabel={`career overview: ${fullName}`}
      headerLabels={[
        <Text_HeaderLabel
          key="name"
          label={fullName}
        />,
        ...personDescriptors.map((someDescriptor) => (
          <Text_HeaderLabel
            key={someDescriptor}
            label={someDescriptor}
          />
        )),
        <Link_HeaderLabel
          key="email"
          label={emailAddress}
          linkHref={`mailto:${emailAddress}`}
        />
      ]}
      bodyContent={[
        <Text_SectionContent 
          key={0}
          accessibilityLabel={`career brief: ${fullName}`}
          contentLabel="brief"
          textContent={briefText}
        />,
        <Text_SectionContent 
          key={1}
          accessibilityLabel={`career status: ${fullName}`}
          contentLabel="status"
          textContent={statusText}
        />,
        <Text_SectionContent 
          key={2}
          accessibilityLabel={`short-term career goal: ${fullName}`}
          contentLabel="short-term goal"
          textContent={shortTerm_goalText}
        />,
        <Text_SectionContent 
          key={3}
          accessibilityLabel={`long-term career goal: ${fullName}`}
          contentLabel="long-term goal"
          textContent={longTerm_goalText}
        />
      ]}
    />
  );
}