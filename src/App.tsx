import { useEffect, useRef, useState } from "react";
import ActivityLog from "./components/ActivityLog";
import activityAPI from "./api/generateActivity";

export default function App() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newActivity, setNewActivity] = useState<Activity | null>(null);
    let isFetching = useRef<boolean>(false);
    let errorCount = useRef<number>(0);
    let timeoutId = useRef<number | undefined>(undefined);
    const maxRetries = 3;
    const delay = 500;

    const markAsRead = (id: string) => {
        const target = activities.find(a => a.id === id);
        
        if(!target) return;

        target.status = "READ";

        setActivities(activities.map((a) => (a.id === target.id ? target : a)));
    }

    const poll = async () => {
        try {
            isFetching.current = true;

            const data = await activityAPI();
            setNewActivity(data);

            errorCount.current = 0;
            isFetching.current = false;
            timeoutId.current = setTimeout(poll, delay);
        } catch(e) {
            errorCount.current++;
            console.error(e);
            console.log(errorCount.current);
            isFetching.current = false;

            if(errorCount.current >= maxRetries) {
                console.error("Max retries reached. Auto-refresh stopped");
            } else {
                poll();
            }
        }
    }

    const refresh = () => {
        console.log(isFetching.current);
        console.log(errorCount.current);

        if(errorCount.current < maxRetries || isFetching.current) return;

        console.log("refreshed");

        errorCount.current = 0;
        poll();
    }

    useEffect(() => {
        if(!isFetching.current) poll();

        return () => {
            clearTimeout(timeoutId.current);
        }
    }, []);

    useEffect(() => {
        if(!newActivity) return;

        setActivities((prev) => [...prev, newActivity]);
    }, [newActivity]);

    return (
        <>
            <button onClick={refresh}>Refresh</button>
            <ActivityLog activities={activities} onRead={markAsRead} />
        </>
    );
}