import { ComponentChildren } from "preact";

export interface Props__Text_SectionContent 
  extends Pick<Props__Base_SectionContent, "contentLabel" | "accessibilityLabel"> {
  textContent: ComponentChildren
}

export function Text_SectionContent({
  contentLabel,
  accessibilityLabel,
  textContent
}: Props__Text_SectionContent) {
  return (
    <__Base_SectionContent
      contentLabel={contentLabel}
      accessibilityLabel={accessibilityLabel}
      sectionContent={
        <div 
          role="paragraph"
          className="textContainer-sectionContent"
        >
          {textContent}
        </div>
      }
    />
  );
}

export interface Props__ColumnList_SectionContent 
  extends Pick<Props__Base_SectionContent, "contentLabel" | "accessibilityLabel"> {
  listItems: Array<ComponentChildren>
}

export function ColumnList_SectionContent({
  accessibilityLabel,
  contentLabel,
  listItems
}: Props__ColumnList_SectionContent) {
  return (
    <__Base_SectionContent
      accessibilityLabel={accessibilityLabel}
      contentLabel={contentLabel}
      sectionContent={
        <div 
          role="list"
          className="columnList_container-sectionContent"
        >
          {listItems.map((someListItem, listItemIndex) => (
            <div
              key={listItemIndex}
              role="listitem"
              className="itemContainer-columnList--sectionContent"
            >
              <div
                role="presentation"
                className="itemBullet-columnList--sectionContent"
              >
                -
              </div>
              <div
                role="paragraph"
                className="item-columnList--sectionContent"
              >
                {someListItem}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}

export interface Props___Temporal__ListItem_Column {
  itemName: string;
  itemDetail: string;
  dateRange: string;
}

export function Temporal__ListItem_Column({
  itemName,
  itemDetail,
  dateRange
}: Props___Temporal__ListItem_Column) {
  return (
    <>
      {itemName}:{" "}
      <span className="detail-listItem--temporal---sectionContent">
        {itemDetail}
      </span>{" "}
      <span className="dateRange-listItem--temporal---sectionContent">
        ({dateRange})
      </span>
    </>
  );
}

export interface Props__WrapList_SectionContent
  extends Pick<Props__Base_SectionContent, "accessibilityLabel" | "contentLabel"> {
  listItems: ComponentChildren[];
}

export function WrapList_SectionContent({
  accessibilityLabel,
  contentLabel,
  listItems
}: Props__WrapList_SectionContent) {
  return (
    <__Base_SectionContent
      accessibilityLabel={accessibilityLabel}
      contentLabel={contentLabel}
      sectionContent={
        <div 
          role="list" 
          className="wrapList_container-sectionContent"
        >
          {listItems.map((someListItem, listItemIndex) => (
            <div
              key={listItemIndex}
              role="listitem"
              className="itemContainer-wrapList--sectionContent"
            >
              <div
                role="paragraph"
                className="item-wrapList--sectionContent"
              >
                {someListItem}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}

interface Props__Base_SectionContent {
  accessibilityLabel: string;
  contentLabel: string;
  sectionContent: ComponentChildren
}

function __Base_SectionContent({
  accessibilityLabel,
  contentLabel,
  sectionContent
}: Props__Base_SectionContent) {
  return (
    <div
      role="region"
      aria-label={accessibilityLabel}
      className="container-sectionContent"
    >
      <div
        role="heading"
        aria-level={3}
        className="labelContainer-sectionContent"
      >
        {contentLabel}
        <div
          role="separator"
          className="labelUnderline-sectionContent"
        />
      </div>
      {sectionContent}
    </div>
  );
}