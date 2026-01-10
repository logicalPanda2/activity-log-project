export default function ActivityItem({activity, onRead}: ActivityItemProps) {
    return (
        <ul key={activity.id}>
            <p>{activity.title}</p>
            <p>{activity.status}</p>
            <button onClick={() => onRead(activity.id)}>Mark as read</button>
        </ul>
    );
}