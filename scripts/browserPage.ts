// A page in headless Chromium, for the scripts that render the built website
// to other formats. The browser is driven over its DevTools protocol, so no
// npm packages are needed: https://chromedevtools.github.io/devtools-protocol/

export interface BrowserPage {
  send<Result>(method: string, params: object): Promise<Result>;
  // loads a local file, then waits for its fonts too
  loadFile(filePath: string): Promise<void>;
  evaluate<Result>(expression: string): Promise<Result>;
}

export async function usingBrowserPage<Result>(
  usePage: (browserPage: BrowserPage) => Promise<Result>,
): Promise<Result> {
  // the binary itself: /usr/bin/chromium-headless-shell is a script that
  // stopping it wouldn't stop the browser it started
  const browserCommand = "/usr/lib/chromium/chromium-headless-shell";
  const browserStopper = new AbortController();
  const browserProcess = new Deno.Command(browserCommand, {
    // port 0 lets the browser pick a free port, which it reports on stderr
    args: ["--remote-debugging-port=0", "--hide-scrollbars"],
    stdout: "null",
    stderr: "piped",
    signal: browserStopper.signal,
  }).spawn();
  try {
    const browserConnection = await connectToBrowser(
      await readDevtoolsSocketUrl(browserProcess.stderr),
    );
    const { targetId } = await browserConnection.sendToBrowser<
      { targetId: string }
    >("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await browserConnection.sendToBrowser<
      { sessionId: string }
    >("Target.attachToTarget", { targetId, flatten: true });
    const sendToPage = <Result>(method: string, params: object) =>
      browserConnection.sendToSession<Result>(sessionId, method, params);
    await sendToPage("Page.enable", {});
    const evaluate = async <Result>(expression: string) => {
      const { result: { value } } = await sendToPage<
        { result: { value: Result } }
      >("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      return value;
    };
    return await usePage({
      send: sendToPage,
      async loadFile(filePath) {
        const [, { errorText }] = await Promise.all([
          browserConnection.waitForEvent(sessionId, "Page.loadEventFired"),
          sendToPage<{ errorText?: string }>("Page.navigate", {
            url: `file://${filePath}`,
          }),
        ]);
        if (errorText) {
          throw new Error(`couldn't load ${filePath}: ${errorText}`);
        }
        await evaluate("document.fonts.ready.then(() => null)");
      },
      evaluate,
    });
  } finally {
    browserStopper.abort();
    await browserProcess.status;
  }
}

export function readContentWidth(browserPage: BrowserPage) {
  return browserPage.evaluate<number>(
    `parseFloat(getComputedStyle(document.querySelector(".contentContainer-body")).flexBasis)`,
  );
}

async function readDevtoolsSocketUrl(
  browserErrorStream: ReadableStream<BufferSource>,
) {
  const browserErrorReader = browserErrorStream
    .pipeThrough(new TextDecoderStream())
    .getReader();
  let browserErrorText = "";
  while (true) {
    const { done, value } = await browserErrorReader.read();
    if (done) {
      throw new Error(`browser exited before it was ready:\n${browserErrorText}`);
    }
    browserErrorText += value;
    const socketUrlMatch = browserErrorText.match(
      /DevTools listening on (ws:\/\/\S+)\n/,
    );
    if (socketUrlMatch) {
      // keep reading so the browser never stalls writing to a full pipe
      drainReader(browserErrorReader);
      return socketUrlMatch[1];
    }
  }
}

async function drainReader(someReader: ReadableStreamDefaultReader<string>) {
  try {
    while (!(await someReader.read()).done) {
      // discard the browser's logging
    }
  } catch {
    // the browser was stopped
  }
}

interface BrowserConnection {
  sendToBrowser<Result>(method: string, params: object): Promise<Result>;
  sendToSession<Result>(
    sessionId: string,
    method: string,
    params: object,
  ): Promise<Result>;
  waitForEvent(sessionId: string, method: string): Promise<unknown>;
}

async function connectToBrowser(socketUrl: string): Promise<BrowserConnection> {
  const browserSocket = new WebSocket(socketUrl);
  await new Promise((resolve, reject) => {
    browserSocket.onopen = resolve;
    browserSocket.onerror = () =>
      reject(new Error(`couldn't connect to ${socketUrl}`));
  });
  let lastMessageId = 0;
  // replies are matched to their request by id, events by session and name
  const pendingReplies = new Map<
    number,
    { method: string } & PromiseWithResolvers<unknown>
  >();
  const pendingEvents = new Map<string, PromiseWithResolvers<unknown>>();
  browserSocket.onmessage = ({ data }) => {
    const someMessage = JSON.parse(data);
    if (someMessage.id === undefined) {
      const eventKey = `${someMessage.sessionId} ${someMessage.method}`;
      pendingEvents.get(eventKey)?.resolve(someMessage.params);
      pendingEvents.delete(eventKey);
      return;
    }
    const pendingReply = pendingReplies.get(someMessage.id)!;
    pendingReplies.delete(someMessage.id);
    if (someMessage.error) {
      pendingReply.reject(
        new Error(`${pendingReply.method}: ${someMessage.error.message}`),
      );
    } else {
      pendingReply.resolve(someMessage.result);
    }
  };
  browserSocket.onclose = () => {
    for (
      const somePending of [...pendingReplies.values(), ...pendingEvents.values()]
    ) {
      somePending.reject(new Error("the browser closed the connection"));
    }
  };
  const sendMessage = <Result>(method: string, messageFields: object) => {
    lastMessageId += 1;
    const pendingReply = { method, ...Promise.withResolvers<unknown>() };
    pendingReplies.set(lastMessageId, pendingReply);
    browserSocket.send(
      JSON.stringify({ id: lastMessageId, method, ...messageFields }),
    );
    return pendingReply.promise as Promise<Result>;
  };
  return {
    sendToBrowser<Result>(method: string, params: object) {
      return sendMessage<Result>(method, { params });
    },
    sendToSession<Result>(sessionId: string, method: string, params: object) {
      return sendMessage<Result>(method, { params, sessionId });
    },
    waitForEvent(sessionId: string, method: string) {
      const pendingEvent = Promise.withResolvers<unknown>();
      pendingEvents.set(`${sessionId} ${method}`, pendingEvent);
      return pendingEvent.promise;
    },
  };
}
