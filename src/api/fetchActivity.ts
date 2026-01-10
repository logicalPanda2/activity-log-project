import activityAPI from "./generateActivity.ts";

export default async function fetchActivity() {
    try {
        const data = await activityAPI();

        return data;
    } catch(error: unknown) {
        if(
            typeof error === "object" &&
            error !== null && 
            "message" in error
        ) { 
            return error.message;
        }
    }
}

//console.log(await fetchActivity());