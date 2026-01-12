export default function ActivityItem({activity, onRead}: ActivityItemProps) {
    return (
        <li key={activity.id} className="p-4 relative" onClick={() => onRead(activity.id)}>
            <p>{activity.title}</p>
            <div className="flex flex-row justify-between mt-4">
                <p className="text-xs">{activity.creator}</p>
                <p className="text-xs">{activity.formattedCreationTime}</p>
            </div>
            {activity.status === "UNREAD"
            ? <div className="absolute top-6 right-6 w-3 h-3 bg-blue-600 rounded-full"></div>
            : <></>}
        </li>
    );
}