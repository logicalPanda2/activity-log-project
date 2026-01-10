import { useEffect, useState } from "react";
import fetchActivity from "./api/fetchActivity";
import usePolling from "./hooks/usePolling";
import ActivityLog from "./components/ActivityLog";

export default function App() {
    const [activity, error] = usePolling<Activity>(fetchActivity, {
        delay: 6000,
    });
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        if(!activity) return;

        setActivities((prev) => [activity, ...prev]);
    }, [activity]);

    const markAsRead = (id: string): void => {
        const activity = activities.find((a) => a.id === id);

        if(!activity) return;

        activity.status = "READ";

        setActivities(activities.map((a) => a.id === activity.id ? activity : a));
    }

	return (<>
        {activities.length > 0 
        ? <ActivityLog 
            activities={activities}
            onRead={markAsRead}
        /> 
        : <p>No logs available</p>}
        {error &&
            <p className="whitespace-pre-line">{error}</p>
        }
    </>);
}