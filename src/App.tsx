import { useEffect, useState } from "react";
import fetchActivity from "./api/fetchActivity";
import usePolling from "./hooks/usePolling";

export default function App() {
    const [activity, error] = usePolling<Activity>(fetchActivity, {
        delay: 6000,
    });
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        if(!activity) return;

        setActivities((prev) => [activity, ...prev]);
    }, [activity]);

    const markAsRead = (id: string) => {
        const activity = activities.find((a) => a.id === id);

        if(!activity) return;

        activity.status = "READ";

        setActivities(activities.map((a) => a.id === activity.id ? activity : a));
    }

	return (<>
        {activities.length > 0 
        ? <li>
            {activities.map((a) => (
                <ul key={a.id}>
                    <p>{a.title}</p>
                    <p>{a.status}</p>
                    <button onClick={() => markAsRead(a.id)}>Mark as read</button>
                </ul>
            ))}
        </li> 
        : <p>No logs available</p>}
        {error &&
            <p className="whitespace-pre-line">{error}</p>
        }
    </>);
}