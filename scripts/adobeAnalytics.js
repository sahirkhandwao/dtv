function checkDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "Mobile";
    }
    return "Desktop";
}

export function trackDishtvAnalytics(eventType, data) {
    const dataLayerKey = eventType === "pageLoaded" ? "xdmPageLoad" : "xdmActionDetails";
    const webKey = eventType === "pageLoaded" ? "webPageDetails" : "webInteraction";

    let userAgent = checkDeviceType();
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let customerID = "";
    let isLogin = false;
    if (userDetails) {
        customerID = userDetails.idu.vcNo.trim();
        isLogin = true;
    }

    const payload = {
        event: eventType,
        ...data
    };

    if (!payload[dataLayerKey].custData) {
        payload[dataLayerKey].custData = {}
    }

    const channelName = data[dataLayerKey]?.web[webKey]?.channel || "";
    const customerIDParam = data[dataLayerKey]?.custData?.customerID || "";

    payload[dataLayerKey].web[webKey].channel = (userAgent === "Mobile" ? "msite" : "web") + "|" + channelName;
    payload[dataLayerKey].web[webKey].brand = "dishtv";
    payload[dataLayerKey].custData.loginStatus = isLogin ? "logged-in" : "guest";
    payload[dataLayerKey].custData.platform = userAgent === "Mobile" ? "mobile website" : "desktop website";
    payload[dataLayerKey].custData.customerID = customerIDParam || customerID;
    payload[dataLayerKey].custData.lang = window.currentLanguage;

    window.adobeDataLayer = window.adobeDataLayer || [];
    console.log("Data layer: ", payload);
    window.adobeDataLayer.push(payload);

    if (window._satellite) {
        if (eventType === "pageLoaded") {
            _satellite.track("generic-vp");
        } else {
            _satellite.track("generic-click");
        }
    }
}