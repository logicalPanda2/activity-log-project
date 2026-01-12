import { useRef, useState } from "react";
import ActivityItem from "./ActivityItem";

export default function ActivityLog({
    activities,
    onRead,
}: ActivityLogProps) {
    const defaultVisible = 5;
    const [visibleActivities, setVisibleActivities] = useState<number>(defaultVisible);
    const screenLimit = 6;
    const mainDiv = useRef<HTMLDivElement | null>(null);

    const loadMore = (): void => {
        setVisibleActivities(v => v + 5);
    }

    const resetVisibleActivities = (): void => {
        setVisibleActivities(5);
    }

    const scrollToTop = (): void => {
        if(!mainDiv.current) return;

        mainDiv.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }

    return (
        <div className="rounded-lg overflow-x-hidden [scrollbar-color:gray_transparent] [scrollbar-width:thin] h-96 max-h-96 w-1/2 min-w-xl border border-solid border-black flex flex-col justify-start relative" ref={mainDiv}>
            <ul>
                {activities.map((a, index) => {
                    if(index > (visibleActivities - 1)) return;

                    return <ActivityItem key={a.id} activity={a} onRead={onRead} />
                })}
            </ul>
            <div className="flex flex-row">
                {activities.length > defaultVisible
                ? visibleActivities < activities.length
                ? <button onClick={loadMore}>Load more</button>
                : <button onClick={resetVisibleActivities}>Collapse</button>
                : <></>}
            </div>
            <div className="h-0 sticky bottom-0 flex flex-row justify-center">
                {activities.length >= screenLimit && visibleActivities >= screenLimit
                ? <button onClick={scrollToTop} className="absolute bottom-4 overflow-visible inline-block w-8 h-8 border border-solid border-black rounded-full">^</button>
                : <></>}
            </div>
        </div>
    );
}