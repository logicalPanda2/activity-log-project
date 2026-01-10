import { useState } from "react";
import ActivityItem from "./ActivityItem";

export default function ActivityLog({
    activities,
    onRead,
}: ActivityLogProps) {
    const [isCollapsed, setCollapsed] = useState<boolean>(true);

    return (
        <div>
            <li>
                {activities.map((a) => (
                    <ActivityItem activity={a} onRead={onRead} />
                ))}
            </li>
            {isCollapsed
            ? <button>Load more</button>
            : <button>Collapse</button>}
        </div>
    );
}