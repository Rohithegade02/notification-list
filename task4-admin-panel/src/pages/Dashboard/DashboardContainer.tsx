import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { DashboardScreen } from "./DashboardScreen";
import { memo } from "react";

export const DashboardContainer = memo(() => {
    const { items, loading, addNotification, resendNotification } = useNotifications();

    const handleCreate = async (data: { title: string; body: string; type: string }) => {
        await addNotification(data.title, data.body, data.type);
        toast("Notification Created", {
            description: "The notification has been added to the list.",
        });
    };

    const handleResend = async (id: string) => {
        await resendNotification(id);
        toast("Notification Resent", {
            description: `Notification ${id} has been resent successfully.`,
        });
    };

    return (
        <DashboardScreen
            items={items}
            loading={loading}
            onCreate={handleCreate}
            onResend={handleResend}
        />
    );
});
