// Renders the image shown when a link to the resume is shared: the resume's
// header section at the website's content width, centered on a card the size
// link previews use

import { readContentWidth, usingBrowserPage } from "./browserPage.ts";

await renderSocialImage({
  pageFilePath: "/home/coder/project/website/index.html",
  imageFilePath: "/home/coder/project/website/assets/resume.social.png",
  imageWidthPixels: 1200,
  imageHeightPixels: 630,
});

interface RenderSocialImageApi {
  pageFilePath: string;
  imageFilePath: string;
  imageWidthPixels: number;
  imageHeightPixels: number;
}

async function renderSocialImage({
  pageFilePath,
  imageFilePath,
  imageWidthPixels,
  imageHeightPixels,
}: RenderSocialImageApi) {
  const imageAspectRatio = imageWidthPixels / imageHeightPixels;
  const minimumMarginPixels = 24;
  await usingBrowserPage(async (browserPage) => {
    await browserPage.loadFile(pageFilePath);
    const contentWidthPixels = await readContentWidth(browserPage);
    await browserPage.send("Emulation.setDeviceMetricsOverride", {
      width: contentWidthPixels,
      height: 1,
      deviceScaleFactor: 1,
      mobile: false,
    });
    // the header section alone, measured by what's visible of it: its text
    // and grey labels, not the empty padding around them
    const headerBox = await browserPage.evaluate<
      { left: number; top: number; width: number; height: number }
    >(`(() => {
      const [headerSection, ...otherSections] =
        document.querySelectorAll(".container-documentSection");
      otherSections.forEach((someSection) => someSection.remove());
      document.querySelector(".container-navigationFooter")?.remove();
      const visibleRects = [
        ...headerSection.querySelectorAll(".headerLabel-documentSection"),
      ].map((someLabel) => someLabel.getBoundingClientRect());
      const textWalker =
        document.createTreeWalker(headerSection, NodeFilter.SHOW_TEXT);
      while (textWalker.nextNode()) {
        const someText = textWalker.currentNode;
        if (
          someText.textContent.trim() === "" ||
          someText.parentElement.closest(".accessibilityHeader-documentSection")
        ) {
          continue;
        }
        const textRange = document.createRange();
        textRange.selectNodeContents(someText);
        visibleRects.push(...textRange.getClientRects());
      }
      const left = Math.min(...visibleRects.map((someRect) => someRect.left));
      const top = Math.min(...visibleRects.map((someRect) => someRect.top));
      const right = Math.max(...visibleRects.map((someRect) => someRect.right));
      const bottom = Math.max(...visibleRects.map((someRect) => someRect.bottom));
      return { left, top, width: right - left, height: bottom - top };
    })()`);
    // the margin that's even on all four sides, where the card's shape
    // allows it, and the card that fits around it; never narrower than the
    // content's width, which would rearrange the layout
    const marginPixels = Math.max(
      (headerBox.width - imageAspectRatio * headerBox.height) /
        (2 * (imageAspectRatio - 1)),
      minimumMarginPixels,
    );
    const cardWidthPixels = Math.round(Math.max(
      headerBox.width + 2 * marginPixels,
      imageAspectRatio * (headerBox.height + 2 * marginPixels),
      contentWidthPixels,
    ));
    const cardHeightPixels = Math.round(cardWidthPixels / imageAspectRatio);
    // main.css centers the content's full width on the wider card; this
    // shifts it so what's visible of it sits in the card's middle
    const contentLeftPixels = (cardWidthPixels - contentWidthPixels) / 2;
    const shiftXPixels = (cardWidthPixels - headerBox.width) / 2 -
      (contentLeftPixels + headerBox.left);
    const shiftYPixels = (cardHeightPixels - headerBox.height) / 2 - headerBox.top;
    await browserPage.evaluate(
      `document.body.style.transform =
        "translate(${shiftXPixels}px, ${shiftYPixels}px)"`,
    );
    // rendered at the image's own resolution, so the text stays sharp
    await browserPage.send("Emulation.setDeviceMetricsOverride", {
      width: cardWidthPixels,
      height: cardHeightPixels,
      deviceScaleFactor: imageWidthPixels / cardWidthPixels,
      mobile: false,
    });
    await browserPage.evaluate(
      "new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
    );
    const { data: imageBase64 } = await browserPage.send<{ data: string }>(
      "Page.captureScreenshot",
      {
        format: "png",
        clip: {
          x: 0,
          y: 0,
          width: cardWidthPixels,
          height: cardHeightPixels,
          scale: 1,
        },
      },
    );
    Deno.mkdirSync(imageFilePath.slice(0, imageFilePath.lastIndexOf("/")), {
      recursive: true,
    });
    await Deno.writeFile(imageFilePath, Uint8Array.fromBase64(imageBase64));
  });
}
