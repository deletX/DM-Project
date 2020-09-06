import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {nominatimToPrimarySecondary} from "../../utils/utils";

/**
 * Autocomplete replacement. A dialog that shows the first three possible places given a query. (using nominatim see
 * {@link https://nominatim.org/release-docs/develop/api/Reverse/})
 */
const PositionsDialog = (props) => {
    const {open, close, positions, selectItem} = props;

    let options = positions.map(item => {
        let {primary, secondary} = nominatimToPrimarySecondary(item)
        return (
            <ListItem
                key={item.place_id}
                button
                onClick={() => {
                    selectItem(item)
                    close()
                }}
            >
                <ListItemText
                    primary={primary}
                    secondary={secondary}/>
            </ListItem>)
    })

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Which one is it?"}
            </DialogTitle>

            <DialogContent>
                <List>
                    {options}
                </List>
            </DialogContent>
        </Dialog>
    )
}

export default PositionsDialog;