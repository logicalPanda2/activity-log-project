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

	return (<>
        {activities.length > 0 
        ? <li>
            {activities.map((a) => (
                <ul key={a.id}>
                    <p>{a.title}</p>
                </ul>
            ))}
        </li> 
        : <p>No logs available</p>}
        {error &&
            <p className="whitespace-pre-line">{error}</p>
        }
    </>);
}