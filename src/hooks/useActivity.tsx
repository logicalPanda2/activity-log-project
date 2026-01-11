import { useState } from "react";

export default function useActivity(): {
    activities: Activity[],
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>,
    markAsRead: (id: string) => void,
    clear: () => void,
} {
    const [activities, setActivities] = useState<Activity[]>([]);

    const markAsRead = (id: string) => {
        const target = activities.find(a => a.id === id);
        
        if(!target) return;

        target.status = "READ";

        setActivities(activities.map((a) => (a.id === target.id ? target : a)));
    }

    const clear = () => {
        setActivities([]);
    }

    return {
        activities,
        setActivities,
        markAsRead,
        clear
    }
}