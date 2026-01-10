import { useState } from "react";
import ActivityItem from "./ActivityItem";

export default function ActivityLog({
    activities,
    onRead,
}: ActivityLogProps) {
    const [visibleActivities, setVisibleActivities] = useState<number>(5);

    const increaseVisibleActivities = (): void => {
        setVisibleActivities(c => c + 5);
    }

    const decreaseVisibleActivities = (): void => {
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
            {/* still dont understand this, refactor later */}
            {activities.length > visibleActivities
            ? <button onClick={increaseVisibleActivities}>Load more</button>
            : activities.length >= visibleActivities 
            ? <button onClick={decreaseVisibleActivities}>Collapse</button>
            : <></>}
        </div>
    );
}