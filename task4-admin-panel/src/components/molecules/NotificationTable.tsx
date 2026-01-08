import { memo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/atoms/table"
import { Button } from "@/components/atoms/button"
import { NotificationBadge } from "@/components/atoms/NotificationBadge"
import { Notification } from "@/types/notification"
import { formatTime } from "@/utils/formatTime"



interface NotificationTableProps {
    items: Notification[]
    onResend: (id: string) => void
}

export const NotificationTable = memo(({ items, onResend }: NotificationTableProps) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Body</TableHead>
                        <TableHead className="w-[150px]">Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                <NotificationBadge type={item.type} />
                            </TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{item.body}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                                {formatTime(item.timestamp)}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => onResend(item.id)}>
                                    Resend
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
})
