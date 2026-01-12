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

interface ActivityItemProps {
    activity: Activity,
    onRead: (id: string) => void,
    index: number,
    totalVisible: number,
}

interface ButtonProps {
    onClick: () => void,
    text: string,
}