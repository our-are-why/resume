import { ComponentChildren } from "preact";

export interface Props__NavigationFooter_Document {
  routeLinks: Array<{
    routeName: string;
    routeHref: string;
    accessibilityLabel: string;
  }>;
  pdfLink: ComponentChildren;
}

export function NavigationFooter_Document({
  routeLinks,
  pdfLink
}: Props__NavigationFooter_Document) {
  return (
    <div role="presentation" className="container-navigationFooter">
      <div role="separator" className="divider-navigationFooter" />
      <div role="navigation" className="navigationContainer-navigationFooter">
        <div role="list" className="linksContainer-navigationFooter">
          {routeLinks.map((someRouteLink) => (
            <div
              key={someRouteLink.routeName}
              role="listitem"
              className="linkContainer-navigationFooter"
            >
              <a
                className="link-navigationFooter"
                href={someRouteLink.routeHref}
                aria-label={someRouteLink.accessibilityLabel}
              >
                {someRouteLink.routeName}
              </a>
            </div>
          ))}
        </div>
        {pdfLink}
      </div>
    </div>
  );
}

export interface Props__PdfLink_NavigationFooter {
  pdfHref: string;
}

export function PdfLink_NavigationFooter({
  pdfHref
}: Props__PdfLink_NavigationFooter) {
  return (
    <div className="container-pdfLink">
      <a href={pdfHref}>view pdf</a>
    </div>
  );
}
