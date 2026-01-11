import { useEffect, useState } from "react";
import fetchActivity from "./api/fetchActivity";
import usePolling from "./hooks/usePolling";
import ActivityLog from "./components/ActivityLog";

export default function App() {
    const {data, error, refresh} = usePolling<Activity>(fetchActivity, {
        delay: 500,
    });
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        if(!data) return;

        setActivities((prev) => [data, ...prev]);
    }, [data]);

    const markAsRead = (id: string): void => {
        const activity = activities.find((a) => a.id === id);

        if(!activity) return;

        activity.status = "READ";

        setActivities(activities.map((a) => a.id === activity.id ? activity : a));
    }

	return (<>
        <button onClick={refresh}>Refresh</button>
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