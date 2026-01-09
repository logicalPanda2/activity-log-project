interface Activity {
    title: string,
    description: string,
    id: string,
    status: ActivityStatus,
    type: ActivityType,
    // add a date here later
    creator: string,
}

type ActivityStatus = "UNREAD" | "READ";
type ActivityType = "UPLOAD" | "REPORT" | "UPDATE";