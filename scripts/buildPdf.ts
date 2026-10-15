// Prints the built website to a pdf as one unbroken page

import { readContentWidth, usingBrowserPage } from "./browserPage.ts";

await renderPdf({
  pageFilePath: "/home/coder/project/website/resume-pdf.html",
  pdfFilePath: "/home/coder/project/website/resume.pdf",
});

interface RenderPdfApi {
  pageFilePath: string;
  pdfFilePath: string;
}

async function renderPdf({
  pageFilePath,
  pdfFilePath,
}: RenderPdfApi) {
  // CSS pixels are a fixed 1/96 of an inch, in print as on screen
  const cssPixelsPerInch = 96;
  await usingBrowserPage(async (browserPage) => {
    // render the website as it looks on screen, not with print styles
    await browserPage.send("Emulation.setEmulatedMedia", { media: "screen" });
    await browserPage.loadFile(pageFilePath);
    const pdfWidthPixels = await readContentWidth(browserPage);
    // lay the page out at the pdf's width; the 1px tall viewport keeps the
    // measured height down to the content's own
    await browserPage.send("Emulation.setDeviceMetricsOverride", {
      width: pdfWidthPixels,
      height: 1,
      deviceScaleFactor: 1,
      mobile: false,
    });
    // rounded up, since a fraction of a pixel left over spills onto a second
    // page
    const pageHeightPixels = await browserPage.evaluate<number>(
      "Math.ceil(document.documentElement.getBoundingClientRect().height)",
    );
    const { data: pdfBase64 } = await browserPage.send<{ data: string }>(
      "Page.printToPDF",
      {
        paperWidth: pdfWidthPixels / cssPixelsPerInch,
        paperHeight: pageHeightPixels / cssPixelsPerInch,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        printBackground: true,
      },
    );
    await Deno.writeFile(pdfFilePath, Uint8Array.fromBase64(pdfBase64));
  });
}
