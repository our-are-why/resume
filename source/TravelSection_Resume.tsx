import { __Base_DocumentSection, Divider_DocumentSection, Text_HeaderLabel } from "./__Base_DocumentSection.tsx";
import { ColumnList_SectionContent, Temporal__ListItem_Column, Text_SectionContent } from "./SectionContent_Document.tsx";

export interface Props__TravelSection_Resume {
  regionName: string;
  roleName: string;
  dateRanges: string[];
  overviewText: string;
  regionTrips: Array<{
    countryNames: string;
    cityNames: string;
    dateRange: string;
  }>;
  lifeLearnings: string[];
}

export function TravelSection_Resume({
  regionName,
  roleName,
  dateRanges,
  overviewText,
  regionTrips,
  lifeLearnings
}: Props__TravelSection_Resume) {
  return (
    <__Base_DocumentSection
      sectionDivider={<Divider_DocumentSection />}
      accessibilityLabel={`travel: ${regionName} - ${roleName}`}
      headerLabels={[
        <Text_HeaderLabel
          key={0}
          label={regionName}
        />,
        <Text_HeaderLabel
          key={1}
          label={roleName}
        />,
        ...dateRanges.map((someDateRange, dateRangeIndex) => (
          <Text_HeaderLabel
            key={2 + dateRangeIndex}
            label={someDateRange}
          />
        ))
      ]}
      bodyContent={[
        <Text_SectionContent
          key={0}
          accessibilityLabel={`overview: ${regionName} - ${roleName}`}
          contentLabel="overview"
          textContent={overviewText}
        />,
        <ColumnList_SectionContent
          key={1}
          accessibilityLabel={`trips: ${regionName} - ${roleName}`}
          contentLabel="trips"
          listItems={regionTrips.map((someTrip) => (
            <Temporal__ListItem_Column
              itemName={someTrip.countryNames}
              itemDetail={someTrip.cityNames}
              dateRange={someTrip.dateRange}
            />
          ))}
        />,
        <ColumnList_SectionContent
          key={2}
          accessibilityLabel={`learnings: ${regionName} - ${roleName}`}
          contentLabel="learnings"
          listItems={lifeLearnings}
        />
      ]}
    />
  );
}
