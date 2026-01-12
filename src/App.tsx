import { useEffect, useState } from "react";
import ActivityLog from "./components/ActivityLog";
import activityAPI from "./api/generateActivity";
import usePolling from "./hooks/usePolling";
import useActivity from "./hooks/useActivity";
import Button from "./components/Button";

export default function App() {
    const [statusFilter, setStatusFilter] = useState<ActivityStatus | string>("none");
    const [typeFilter, setTypeFilter] = useState<ActivityType | string>("none");
    const {
        activities,
        setActivities,
        markAsRead,
        clear
    } = useActivity();
    const {
        data,
        pollingEnabled,
        refresh,
        pauseAndResume
    } = usePolling<Activity>(activityAPI);
    const statusFiltered = statusFilter !== "none" ? activities.filter(a => a.status === statusFilter) : activities;
    const typeFiltered = typeFilter !== "none" ? activities.filter(a => a.type === typeFilter) : statusFiltered;

    useEffect(() => {
        if(!data) return;

        setActivities((prev) => [data, ...prev]);
    }, [data]);

    return (
        <main className="flex flex-col flex-nowrap">
            <div className="flex flex-row flex-nowrap justify-between items-center px-20">
                <div>
                    <Button onClick={refresh} text="Refresh" />
                    <Button onClick={pauseAndResume} text={pollingEnabled ? "Pause" : "Resume"} />
                    <Button onClick={clear} text="Clear" />
                </div>
                <div className="flex flex-row flex-nowrap">
                    <div className="flex flex-col flex-nowrap mx-2">
                        <label htmlFor="statusFilter">Status</label>
                        <select name="statusFilter" id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="none">None</option>
                            <option value="READ">Read</option>
                            <option value="UNREAD">Unread</option>
                        </select>
                    </div>
                    <div className="flex flex-col flex-nowrap mx-2">
                        <label htmlFor="typeFilter">Type</label>
                        <select name="typeFilter" id="typeFilter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value="none">None</option>
                            <option value="UPLOAD">Upload</option>
                            <option value="UPDATE">Update</option>
                            <option value="REPORT">Report</option>
                        </select>
                    </div>
                </div>    
            </div>
            <div className="flex flex-col grow items-center justify-end overflow-hidden">
                <ActivityLog activities={typeFiltered} onRead={markAsRead} />
            </div>
        </main>
    );
}