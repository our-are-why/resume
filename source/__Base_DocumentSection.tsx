import { ComponentChildren } from "preact";

export interface Props__Base_DocumentSection {
  sectionDivider: ComponentChildren;
  accessibilityLabel: string;
  headerLabels: Array<ComponentChildren>
  bodyContent: ComponentChildren
}

export function __Base_DocumentSection({
  sectionDivider,
  accessibilityLabel,
  headerLabels,
  bodyContent
}: Props__Base_DocumentSection) {
  return (
    <div role="none" className="container-documentSection">
      {sectionDivider}
      <div 
        role="region" 
        aria-label={accessibilityLabel} 
        className="contentContainer-documentSection"
      >
        <div
          role="heading"
          aria-level={2}
          className="accessibilityHeader-documentSection"
        >
          {accessibilityLabel}
        </div>
        <div 
          role="list" 
          className="headerContainer-documentSection"
        >
          {headerLabels.map((someHeaderLabel, labelIndex) => (
            <div 
              role="listitem" 
              className="labelContainer-documentSection" 
              key={labelIndex}
            >
              {someHeaderLabel}
            </div>
          ))}
        </div>
        <div 
          role="presentation"
          className="bodyContainer-documentSection"
        >
          <div
            role="group"
            className="bodyContent_container-documentSection"
          >
            {bodyContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Divider_DocumentSection() {
  return (
    <div
      role="separator"
      className="divider-documentSection"
    />
  );
}

export interface Props__Text_HeaderLabel {
  label: string;
}

export function Text_HeaderLabel({
  label
}: Props__Text_HeaderLabel) {
  return (
    <div
      className="headerLabel-documentSection"
    >
      {label}
    </div>
  );
}

export interface Props__Link_HeaderLabel {
  label: string;
  linkHref: string;
}

export function Link_HeaderLabel({
  linkHref,
  label
}: Props__Link_HeaderLabel) {
  return (
    <a 
      className='headerLabel-documentSection'
      href={linkHref}
    >
      {label}
    </a>
  );
}