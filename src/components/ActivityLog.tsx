import { useState } from "react";
import ActivityItem from "./ActivityItem";

export default function ActivityLog({
    activities,
    onRead,
}: ActivityLogProps) {
    const defaultVisible = 5;
    const [visibleActivities, setVisibleActivities] = useState<number>(defaultVisible);
    const screenLimit = 9;

    const loadMore = (): void => {
        setVisibleActivities(v => v + 5);
    }

    const resetVisibleActivities = (): void => {
        setVisibleActivities(5);
    }

    const scrollToTop = (): void => {
        window.scrollTo(0, 0);
    }

    return (
        <div>
            <ul>
                {activities.map((a, index) => {
                    if(index > (visibleActivities - 1)) return;

                    return <ActivityItem key={a.id} activity={a} onRead={onRead} />
                })}
            </ul>
            {activities.length > defaultVisible
            ? visibleActivities < activities.length
            ? <button onClick={loadMore}>Load more</button>
            : <button onClick={resetVisibleActivities}>Collapse</button>
            : <></>
            }
            <br />
            {activities.length >= screenLimit && visibleActivities >= screenLimit
            ? <button onClick={scrollToTop}>Jump to newest</button> 
            : <></>}
        </div>
    );
}