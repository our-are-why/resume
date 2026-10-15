import { renderToString } from "preact-render-to-string";
import { createElement, FunctionComponent } from "preact";
import { Page_NotFound } from "../source/Page_NotFound.tsx";
import { Page_Resume, PdfPage_Resume } from "../source/Page_Resume.tsx";

await renderPages({
  projectDirectoryPath: "/home/coder/project",
  websiteDirectoryPath: "/home/coder/project/website",
  staticFilePaths: {
    "main.css": "source/main.css",
    "fonts/CourierPrime-Regular.ttf": "assets/fonts/CourierPrime-Regular.ttf",
    "fonts/CourierPrime-Bold.ttf": "assets/fonts/CourierPrime-Bold.ttf",
    "fonts/CourierPrime-Italic.ttf": "assets/fonts/CourierPrime-Italic.ttf",
    "fonts/CourierPrime-BoldItalic.ttf": "assets/fonts/CourierPrime-BoldItalic.ttf",
    "fonts/OFL.txt": "assets/fonts/OFL.txt",
    "favicon.ico": "assets/icons/favicon.ico",
    "apple-touch-icon.png": "assets/icons/apple-touch-icon.png",
    "_headers": "assets/_headers",
  },
  pageDescriptions: [
    {
      pageFileName: "index",
      PageComponent: Page_Resume,
    },
    // what deno task buildPdf prints to resume.pdf
    {
      pageFileName: "resume-pdf",
      PageComponent: PdfPage_Resume,
    },
    // served by Cloudflare for any address that doesn't exist
    {
      pageFileName: "404",
      PageComponent: Page_NotFound,
    },
  ],
});

interface RenderPagesApi {
  projectDirectoryPath: string;
  websiteDirectoryPath: string;
  // each file's path in the website, and the project file it's copied from
  staticFilePaths: Record<string, string>;
  pageDescriptions: Array<{
    pageFileName: string;
    PageComponent: FunctionComponent;
  }>;
}

async function renderPages({
  projectDirectoryPath,
  websiteDirectoryPath,
  staticFilePaths,
  pageDescriptions,
}: RenderPagesApi) {
  try {
    Deno.removeSync(websiteDirectoryPath, { recursive: true });
  } catch (someError) {
    if (!(someError instanceof Deno.errors.NotFound)) {
      throw someError;
    }
  }
  Deno.mkdirSync(websiteDirectoryPath, { recursive: true });
  for (
    const [someWebsiteFilePath, someProjectFilePath] of Object.entries(
      staticFilePaths,
    )
  ) {
    const websiteFilePath = `${websiteDirectoryPath}/${someWebsiteFilePath}`;
    Deno.mkdirSync(
      websiteFilePath.slice(0, websiteFilePath.lastIndexOf("/")),
      { recursive: true },
    );
    Deno.copyFileSync(
      `${projectDirectoryPath}/${someProjectFilePath}`,
      websiteFilePath,
    );
  }
  await Promise.all(
    pageDescriptions.map(async ({
      PageComponent,
      pageFileName,
    }) => {
      const pageHtml = renderToString(
        createElement(PageComponent, {}),
      );
      await Deno.writeTextFile(
        `${websiteDirectoryPath}/${pageFileName}.html`,
        `<!DOCTYPE html>${pageHtml}`,
      );
    }),
  );
}
