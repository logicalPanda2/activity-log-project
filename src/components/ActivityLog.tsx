import { useRef, useState } from "react";
import ActivityItem from "./ActivityItem";

export default function ActivityLog({
    activities,
    onRead,
}: ActivityLogProps) {
    const defaultVisible = 5;
    const [visibleActivities, setVisibleActivities] = useState<number>(defaultVisible);
    const [topOffset, setTopOffset] = useState<number | undefined>(undefined);
    const mainDiv = useRef<HTMLDivElement | null>(null);
    const itemHeightPx = 88;

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
        <div className="rounded-lg overflow-x-hidden [scrollbar-color:gray_transparent] [scrollbar-width:thin] h-96 max-h-96 w-1/2 min-w-xl border border-solid border-black flex flex-col justify-start relative p-4" ref={mainDiv} onScroll={() => setTopOffset(mainDiv.current?.scrollTop)}>
            <ul className="flex flex-col gap-4 mb-4">
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
                { topOffset && topOffset >= itemHeightPx
                ? <button onClick={scrollToTop} className="absolute bottom-4 overflow-visible w-8 h-8 border border-solid border-black rounded-full bg-neutral-100">
                    <span className="inline-block transform-[scaleX(1.5)] relative left-[2.5px] -top-0.75">^</span>
                    <span className="inline-block transform-[scaleY(0.75)] relative -left-1.25 -top-0.5">|</span>
                </button>
                : <></>}
            </div>
        </div>
    );
}