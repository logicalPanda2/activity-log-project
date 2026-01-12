export default function ActivityItem({activity, onRead}: ActivityItemProps) {
    return (
        <li key={activity.id} className="pb-4 relative border-b border-solid border-b-black" onClick={() => onRead(activity.id)}>
            <p>{activity.title}</p>
            <div className="flex flex-row justify-between mt-4">
                <p className="text-xs">{activity.creator}</p>
                <p className="text-xs">{activity.formattedCreationTime}</p>
            </div>
            {activity.status === "UNREAD"
            ? <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full"></div>
            : <></>}
        </li>
    );
}