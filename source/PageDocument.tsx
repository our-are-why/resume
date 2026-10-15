import { ComponentChildren } from "preact";

export interface Props__Listed_PageDocument
  extends Pick<
    Props__Base_PageDocument,
    "tabTitle_page" | "description_page" | "accessibilityLabel" | "rootPath_site" | "children"
  > {
  url_page: string;
  url_socialImage: string;
  altText_socialImage: string;
}

export function Listed_PageDocument({
  tabTitle_page,
  description_page,
  accessibilityLabel,
  rootPath_site,
  url_page,
  url_socialImage,
  altText_socialImage,
  children,
}: Props__Listed_PageDocument) {
  return (
    <__Base_PageDocument
      tabTitle_page={tabTitle_page}
      description_page={description_page}
      accessibilityLabel={accessibilityLabel}
      rootPath_site={rootPath_site}
      pageMetadata={
        <>
          <link rel="canonical" href={url_page} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={url_page} />
          <meta property="og:title" content={tabTitle_page} />
          <meta property="og:description" content={description_page} />
          <meta property="og:image" content={url_socialImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={altText_socialImage} />
          <meta name="twitter:card" content="summary_large_image" />
        </>
      }
    >
      {children}
    </__Base_PageDocument>
  );
}

export interface Props__Unlisted_PageDocument
  extends Pick<
    Props__Base_PageDocument,
    "tabTitle_page" | "description_page" | "accessibilityLabel" | "rootPath_site" | "children"
  > {}

export function Unlisted_PageDocument({
  tabTitle_page,
  description_page,
  accessibilityLabel,
  rootPath_site,
  children,
}: Props__Unlisted_PageDocument) {
  return (
    <__Base_PageDocument
      tabTitle_page={tabTitle_page}
      description_page={description_page}
      accessibilityLabel={accessibilityLabel}
      rootPath_site={rootPath_site}
      pageMetadata={<meta name="robots" content="noindex" />}
    >
      {children}
    </__Base_PageDocument>
  );
}

interface Props__Base_PageDocument {
  tabTitle_page: string;
  description_page: string;
  accessibilityLabel: string;
  rootPath_site: string;
  pageMetadata: ComponentChildren;
  children: ComponentChildren;
}

function __Base_PageDocument({
  tabTitle_page,
  description_page,
  accessibilityLabel,
  rootPath_site,
  pageMetadata,
  children,
}: Props__Base_PageDocument) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>{tabTitle_page}</title>
        <meta name="description" content={description_page} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {pageMetadata}
        <meta name="color-scheme" content="only light" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href={`${rootPath_site}favicon.ico`} />
        <link rel="apple-touch-icon" href={`${rootPath_site}apple-touch-icon.png`} />
        <link rel="stylesheet" href={`${rootPath_site}main.css`} />
      </head>
      <body>
        <div role="presentation" className="container-body">
          <div role="main" className="contentContainer-body">
            <div role="heading" aria-level={1} className="mainHeader-body">
              {accessibilityLabel}
            </div>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
