interface Activity {
    title: string,
    id: string,
    status: ActivityStatus,
    type: ActivityType,
    formattedCreationTime: string,
    date: number,
    month: number,
    year: number,
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

interface ActivityLogProps {
    activities: Activity[],
    onRead: (id: string) => void,
}