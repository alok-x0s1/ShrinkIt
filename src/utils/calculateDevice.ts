import { AnalyticsType } from "@/models/linkModel";

const calculateDevice = (analytics: AnalyticsType[]) => {
	const device = {
		desktop: 0,
		mobile: 0,
		tablet: 0,
	};

	analytics.forEach((analytic) => {
		if (analytic.device.toLowerCase() === "desktop") {
			device.desktop++;
		} else if (analytic.device.toLowerCase() === "mobile") {
			device.mobile++;
		} else if (analytic.device.toLowerCase() === "tablet") {
			device.tablet++;
		}
	});

	return device;
};

export default calculateDevice;
