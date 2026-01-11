import { useEffect, useState } from "react";
import ActivityLog from "./components/ActivityLog";
import activityAPI from "./api/generateActivity";
import usePolling from "./hooks/usePolling";

export default function App() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [statusFilter, setStatusFilter] = useState<ActivityStatus | string>("none");
    const [typeFilter, setTypeFilter] = useState<ActivityType | string>("none");
    const {
        data,
        pollingEnabled,
        refresh,
        pauseAndResume
    } = usePolling(activityAPI);
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

    const clear = () => {
        setActivities([]);
    }

    useEffect(() => {
        if(!data) return;

        setActivities((prev) => [...prev, data]);
    }, [data]);

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