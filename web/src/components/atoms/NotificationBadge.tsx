import { Badge } from "@/components/atoms/badge"
import { NotificationType } from "@/types/notification"

const TYPE_COLORS: Record<NotificationType, string> = {
    transactional: "bg-blue-500 hover:bg-blue-600",
    marketing: "bg-purple-500 hover:bg-purple-600",
    alert: "bg-red-500 hover:bg-red-600",
    info: "bg-green-500 hover:bg-green-600",
}

export function NotificationBadge({ type }: { type: NotificationType }) {
    return (
        <Badge className={`${TYPE_COLORS[type]} border-0 capitalize`}>
            {type}
        </Badge>
    )
}
