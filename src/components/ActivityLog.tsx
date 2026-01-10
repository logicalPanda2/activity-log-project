import { useState } from "react";
import ActivityItem from "./ActivityItem";

export default function ActivityLog({
    activities,
    onRead,
}: ActivityLogProps) {
    const [visibleActivities, setVisibleActivities] = useState<number>(5);

    const loadMore = (): void => {
        const len = activities.length;

        if(visibleActivities + 5 < len) setVisibleActivities(v => v + 5);
        else setVisibleActivities(len);
    }

    const resetVisibleActivities = (): void => {
        setVisibleActivities(5);
    }

    return (
        <div>
            <li>
                {activities.map((a, index) => {
                    if(index > (visibleActivities - 1)) return;

                    return <ActivityItem activity={a} onRead={onRead} />
                })}
            </li>
            {/* Flawed logic, the collapse button appears before it is needed
                TODO REFACTOR EVENTUALLY
            */}
            {activities.length > visibleActivities
            ? <button onClick={loadMore}>Load more</button>
            : activities.length >= visibleActivities
            ? <button onClick={resetVisibleActivities}>Collapse</button>
            : <></>}
        </div>
    );
}