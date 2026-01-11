import { useEffect, useRef, useState } from "react";
import ActivityLog from "./components/ActivityLog";
import activityAPI from "./api/generateActivity";

export default function App() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newActivity, setNewActivity] = useState<Activity | null>(null);
    const [pollingEnabled, setPollingEnabled] = useState(true);
    const [statusFilter, setStatusFilter] = useState<ActivityStatus | string>("none");
    const [typeFilter, setTypeFilter] = useState<ActivityType | string>("none");
    let isFetching = useRef<boolean>(false);
    let errorCount = useRef<number>(0);
    let timeoutId = useRef<number | undefined>(undefined);
    const maxRetries = 3;
    const delay = 5000;
    const filteredActivities = 
        statusFilter !== "none"
        ? typeFilter !== "none"
        ? activities.filter(a => a.status === statusFilter).filter(a => a.type === typeFilter)
        : activities.filter(a => a.status === statusFilter)
        : activities

    const markAsRead = (id: string) => {
        const target = activities.find(a => a.id === id);
        
        if(!target) return;

        target.status = "READ";

        setActivities(activities.map((a) => (a.id === target.id ? target : a)));
    }

    const poll = async () => {
        if(isFetching.current) return;

        isFetching.current = true;

        try {
            const data = await activityAPI();
            setNewActivity(data);
            errorCount.current = 0;
        } catch(e) {
            errorCount.current++;
            console.error(e);

            if(errorCount.current >= maxRetries) {
                setPollingEnabled(false);
                console.error("Max retries exceeded. Stopping auto-refresh..");
            }
        } finally {
            isFetching.current = false;
        }
    }

    const refresh = () => {
        if(pollingEnabled) return;

        errorCount.current = 0;
        setPollingEnabled(true);
    }

    const pauseAndResume = () => {
        clearTimeout(timeoutId.current);
        setPollingEnabled(!pollingEnabled);
    }

    const clear = () => {
        setActivities([]);
    }

    useEffect(() => {
        if(!pollingEnabled) return;

        let cancelled = false;

        const tick = async () => {
            if(cancelled) return;

            await poll();

            if(!cancelled && pollingEnabled) {
                timeoutId.current = setTimeout(tick, delay);
            }
        };

        tick();

        return () => {
            cancelled = true;
            if(timeoutId.current) clearTimeout(timeoutId.current);
        };
    }, [pollingEnabled]);

    useEffect(() => {
        if(!newActivity) return;

        setActivities((prev) => [...prev, newActivity]);
    }, [newActivity]);

    return (
        <>
            <button onClick={refresh}>Refresh</button>
            <button onClick={pauseAndResume}>{pollingEnabled ? "Pause" : "Resume"}</button>
            <button onClick={clear}>Clear</button>
            <label htmlFor="statusFilter">Filter by status</label>
            <select name="statusFilter" id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="none">None</option>
                <option value="READ">Read</option>
                <option value="UNREAD">Unread</option>
            </select>
            <label htmlFor="typeFilter">Filter by type</label>
            <select name="typeFilter" id="typeFilter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="none">None</option>
                <option value="UPLOAD">Upload</option>
                <option value="UPDATE">Update</option>
                <option value="REPORT">Report</option>
            </select>
            <ActivityLog activities={filteredActivities} onRead={markAsRead} />
        </>
    );
}