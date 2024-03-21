import { showHUD, getFrontmostApplication } from "@raycast/api";
import { runAppleScript } from "@raycast/utils";
import { keydownAction } from "./utils/keydownAction";
import resources from "./data/resources.json";
import { Key, Modifier } from "./types/key";

const { browsers, applications, websites } = resources;

async function getActiveTabUrl(browser: string) {
  const script =
    browser === "Safari"
      ? `
    tell application "Safari"
      if it is running then
        get URL of front document
      end if
    end tell
  `
      : `
    tell application "${browser}"
      if it is running then
        get URL of active tab of front window
      end if
    end tell
  `;
  try {
    const url = await runAppleScript(script);
    return url;
  } catch (error) {
    showHUD("Get active tab URL failed.");
    return null;
  }
}

function applyToWebsite(url: string | null | undefined, runKeydown: ReturnType<typeof keydownAction>) {
  if (!url) {
    return showHUD("Active tab not found.");
  }

  const urlObject = new URL(url ?? "");

  for (const website of websites) {
    if (urlObject.href.includes(website.url)) {
      return runKeydown(website.key as Key, website.modifiers as Modifier[]);
    }
  }

  return showHUD("Invalid command for this website");
}

export default async function applyCodeStyle() {
  const frontmostApplication = await getFrontmostApplication();
  const { name: appName } = frontmostApplication;

  const runKeydown = keydownAction(appName);

  if (browsers.includes(appName)) {
    const url = await getActiveTabUrl(appName);

    return applyToWebsite(url, runKeydown);
  }

  for (const application of applications) {
    if (appName === application.name) {
      return runKeydown(application.key as Key, application.modifiers as Modifier[]);
    }
  }

  return showHUD("Invalid command for this application");
}
