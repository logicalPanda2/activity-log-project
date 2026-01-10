import { useState } from "react";

export default function ActivityLog({
    activities,
    onRead,
}: ActivityLogProps) {
    const [isCollapsed, setCollapsed] = useState<boolean>(true);

    return (
        <div>
            <li>
                {activities.map((a) => (
                    <ul key={a.id}>
                        <p>{a.title}</p>
                        <p>{a.status}</p>
                        <button onClick={() => onRead(a.id)}>Mark as read</button>
                    </ul>
                ))}
            </li>
            {isCollapsed
            ? <button>Load more</button>
            : <button>Collapse</button>}
        </div>
    );
}