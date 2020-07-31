import React, {Component} from 'react';
import Portal from "react-native-paper";
import Dialog from "react-native-paper";
import Button from "react-native-paper";


const LeaveEventComponent = (props) => {
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Do you really want to leave this event?</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={() => console.log('Cancel')}>Cancel</Button>
                    <Button onPress={() => console.log('Ok')}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default LeaveEventComponent