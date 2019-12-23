// Test if the cookie consent library has been loaded.
function isConsentLibraryLoaded(): boolean {
    return typeof(mscc) !== "undefined";
}

// Test if we have been granted consent to use cookies.
function canReadWriteCookies(): boolean {
    // If we don't have the MSCC cookie JS code loaded we don't know if the user
    // has consented to cookies or not.
    if (!isConsentLibraryLoaded()) {
        return false;
    }

    return mscc.hasConsent();
}

// Register the passed function to be called when we are granted consent to use cookies.
function onCookieConsentGranted(callback: () => void): void {
    mscc.on("consent", callback);
}

export const cookie = {
    isConsentLibraryLoaded,
    canReadWriteCookies,
    onCookieConsentGranted,
};
