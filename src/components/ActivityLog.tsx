import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const showJumpButton = (topOffset ?? 0) >= itemHeightPx;

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
            <ul className="flex flex-col gap-4 mb-4" aria-live="polite">
                <AnimatePresence>
                {activities.slice(0, visibleActivities).map((a, index) => {
                    return <ActivityItem key={a.id} activity={a} onRead={onRead} index={index} />
                })}
                </AnimatePresence>
            </ul>
            <div className="flex flex-row">
                {activities.length > defaultVisible
                ? visibleActivities < activities.length
                ? <button onClick={loadMore} className="hover:text-neutral-600 transition">Load more</button>
                : <button onClick={resetVisibleActivities} className="hover:text-neutral-600 transition">Collapse</button>
                : <></>}
            </div>
            <div className="h-0 sticky bottom-0 flex flex-row justify-center">
                <AnimatePresence>
                { showJumpButton && (
                    <motion.button
                        onClick={scrollToTop} 
                        className="absolute bottom-2 overflow-visible w-8 h-8 border bg-blue-600 text-white hover:bg-blue-600/75 active:bg-blue-600/50 rounded-full transition" 
                        aria-label="Jump to newest" 
                        key="jump-to-top"
                        initial={{ opacity: 0, y: 20, scale: 0.75 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <span className="inline-block transform-[scaleX(1.5)] relative left-[2.5px] -top-0.5 text-white" aria-hidden="true">^</span>
                        <span className="inline-block transform-[scaleY(0.75)] relative -left-1.25 -top-px text-white" aria-hidden="true">|</span>
                    </motion.button>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
}