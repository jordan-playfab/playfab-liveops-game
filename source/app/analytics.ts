import { cookie } from "./shared/cookies";

declare var awa: any;

function injectAnalytics(): void {
    const insertJS = (js: string, callback: () => void) => {
        const script = document.createElement("script") as HTMLScriptElement;

        script.src = js;
        script.onload = callback;

        document.body.appendChild(script);
    };

    insertJS("https://az725175.vo.msecnd.net/scripts/jsll-4.js", () => {
        const config = {
            coreData: {
                appId: "vanguardoutrider",
                market: "en-us",
            },
        };
        awa.init(config);
    });
}

export default function setupAnalytics(): void {
    // We can only setup analytics if we have the consent library loaded.
    if (!cookie.isConsentLibraryLoaded()) {
        return;
    }

    // If we have consent already, we can inject our analytics tracking.
    // If we don't have consent, we wait until we get consent and then
    // inject the analytics tracking.
    if (cookie.canReadWriteCookies()) {
        injectAnalytics();
    }
    else {
        cookie.onCookieConsentGranted(injectAnalytics);
    }
}
