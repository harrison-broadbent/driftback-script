const PRODUCTION_ORIGIN = "https://driftback.app";
const DEVELOPMENT_ORIGIN = "http://localhost:3000";

export const DRIFTBACK_ORIGIN = (typeof window !== "undefined" && window.location.hostname === "localhost") ? DEVELOPMENT_ORIGIN : PRODUCTION_ORIGIN;
export const API_SURVEYS_PATH = "/api/v1/surveys";
export const DEFAULT_IFRAME_WIDTH = 360;
export const DEFAULT_IFRAME_HEIGHT = 0;

export function buildEmbedUrl(projectId, surveyId, email, metadata) {
	const embedPath = `/${encodeURIComponent(projectId)}/surveys/${encodeURIComponent(surveyId)}/embed`;

	const current_href = new URL(window.location.href); current_href.search = ''; // strip query params for privacy
	const url = new URL(embedPath, DRIFTBACK_ORIGIN)
	url.searchParams.set("email", email);
	url.searchParams.set("metadata", JSON.stringify(metadata));
	url.searchParams.set("url", current_href)

	return url.toString();
}

export function buildSurveysApiUrl(projectId, email) {
	const url = new URL(API_SURVEYS_PATH, DRIFTBACK_ORIGIN);
	const current_href = new URL(window.location.href); current_href.search = ''; // strip query params for privacy

	url.searchParams.set("project_id", projectId);
	url.searchParams.set("email", email);
	url.searchParams.set("url", current_href)

	return url.toString();
}
