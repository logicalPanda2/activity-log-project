interface Activity {
    title: string,
    id: string,
    status: ActivityStatus,
    type: ActivityType,
    // add a date here later
    creator: string,
}

type ActivityStatus = "UNREAD" | "READ";
type ActivityType = "UPLOAD" | "REPORT" | "UPDATE";

type SUBJECTS = string[];
type PREDICATES = [string, ActivityType][];
type OBJECTS = string[];

interface DATABASE {
    SUBJECTS: SUBJECTS,
    PREDICATES: PREDICATES,
    OBJECTS: OBJECTS,
}