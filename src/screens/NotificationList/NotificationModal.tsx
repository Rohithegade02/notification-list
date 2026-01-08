import { AppText } from '@/src/components/atoms/AppText';
import { Notification } from '@/src/types/notification';
import React from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import { styles } from './styles';

interface NotificationModalProps {
    visible: boolean;
    selectedItem: Notification | null;
    onCloseDetail: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
    visible,
    selectedItem,
    onCloseDetail,
}) => {
    return (
        <Modal
            visible={!!selectedItem}
            transparent
            animationType="fade"
            onRequestClose={onCloseDetail}
        >
            <TouchableWithoutFeedback onPress={onCloseDetail}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            {selectedItem && (
                                <React.Fragment>
                                    <AppText variant="title" weight="bold" style={{ marginBottom: 8 }}>
                                        {selectedItem.title}
                                    </AppText>
                                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                                        <AppText variant="caption" color="#666">
                                            {new Date(selectedItem.timestamp).toLocaleString()}
                                        </AppText>
                                    </View>
                                    <AppText variant="body" style={{ lineHeight: 22 }}>
                                        {selectedItem.body}
                                    </AppText>
                                </React.Fragment>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default NotificationModal