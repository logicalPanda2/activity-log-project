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
                    <div className="flex flex-col flex-nowrap mx-2 gap-2">
                        <label htmlFor="statusFilter">Status</label>
                        <div className="px-4 py-1 bg-blue-600 text-white hover:bg-blue-600/75 rounded focus-within:outline-2 focus-within:outline-solid focus-within:outline-black transition">
                            <select name="statusFilter" id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="focus:outline-none focus-visible:outline-none">
                                <option value="none" className="text-black">None</option>
                                <option value="READ" className="text-black">Read</option>
                                <option value="UNREAD" className="text-black">Unread</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col flex-nowrap mx-2 gap-2">
                        <label htmlFor="typeFilter">Type</label>
                        <div className="px-4 py-1 bg-blue-600 text-white hover:bg-blue-600/75 rounded focus-within:outline-2 focus-within:outline-solid focus-within:outline-black transition">
                            <select name="typeFilter" id="typeFilter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="focus:outline-none focus-visible:outline-none">
                                <option value="none" className="text-black">None</option>
                                <option value="UPLOAD" className="text-black">Upload</option>
                                <option value="UPDATE" className="text-black">Update</option>
                                <option value="REPORT" className="text-black">Report</option>
                            </select>
                        </div>
                    </div>
                </div>    
            </div>
            <div className="flex flex-col grow items-center justify-end overflow-hidden">
                <ActivityLog activities={typeFiltered} onRead={markAsRead} />
            </div>
        </main>
    );
}