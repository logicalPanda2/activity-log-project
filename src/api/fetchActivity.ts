import activityAPI from "./generateActivity.ts";

export default async function fetchActivity() {
    try {
        const data = await activityAPI();

        return data;
    } catch(error: unknown) {
        throw error;
    }
}
