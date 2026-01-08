import { CreateNotificationForm } from "@/components/molecules/CreateNotificationForm";
import { NotificationTable } from "@/components/molecules/NotificationTable";
import { Notification } from "@/types/notification";
import { memo } from "react";

interface DashboardScreenProps {
    items: Notification[];
    loading: boolean;
    onCreate: (data: { title: string; body: string; type: string }) => void;
    onResend: (id: string) => void;
}

export const DashboardScreen = memo(({ items, loading, onCreate, onResend }: DashboardScreenProps) => {
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <CreateNotificationForm onCreate={onCreate} />
            </div>

            {loading ? (
                <div className="flex justify-center p-10">Loading...</div>
            ) : (
                <NotificationTable items={items} onResend={onResend} />
            )}
        </div>
    )
})
