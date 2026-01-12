import { motion, usePresence } from "framer-motion";

export default function ActivityItem({activity, onRead, index}: ActivityItemProps) {
    const itemVariants = {
        hidden: {
            opacity: 0,
            x: -600,
        },
        visible: {
            opacity: 1,
            x: 0,
        },
    };
    const defaultVisible = 5;
    const [isPresent, safeToRemove] = usePresence();

    return (
        <motion.li 
            className="pb-4 relative border-b border-solid border-b-black" 
            onClick={() => onRead(activity.id)}
            variants={itemVariants}
            initial={{ opacity: 0, x: -600 }}
            animate={{ opacity: 1, x: 0 }}
            onAnimationComplete={() => {
                if(!isPresent) safeToRemove();
            }}
            transition={{ delay: isPresent ? (index % defaultVisible) * 0.05 : 0, duration: 0.35, ease: "easeOut", type: "spring" }}
        >
            <p>{activity.title}</p>
            <div className="flex flex-row justify-between mt-4">
                <p className="text-xs">{activity.creator}</p>
                <p className="text-xs">{activity.formattedCreationTime}</p>
            </div>
            {activity.status === "UNREAD" && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full"></div>
            )}
        </motion.li>
    );
}