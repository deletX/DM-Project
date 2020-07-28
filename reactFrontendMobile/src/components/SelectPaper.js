import React, {Component} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, List, Menu, TextInput, Text} from "react-native-paper";

class Option extends Component {
    onPress = () => {
        const {index, onPress} = this.props;

        if (typeof onPress === "function") {
            onPress(index);
        }
    };

    render() {
        const {selected, title} = this.props;
        return (
            <TouchableOpacity
                style={{
                    backgroundColor: selected ? "lightgray" : "white",
                    padding: 16,
                    width: this.props.width
                }}
                onPress={this.onPress}
            >
                <Text style={{fontSize: 17}}>{title}</Text>
            </TouchableOpacity>
        );
    }
}

export default class Select extends Component {
    static defaultProps = {
        data: [],

        disabled: false,

        valueExtractor: ({value} = {}, index) => value,
        labelExtractor: ({label} = {}, index) => label
    };

    state = {
        error: "",
        itemHeight: 54,
        open: false,
        selected: -1,
        value: this.props.value,
        width: 350
    };

    componentWillReceiveProps({value}) {
        if (value !== this.props.value) {
            this.setState({value});
        }
    }

    onPress = () => {
        let selected = this.selectedIndex();

        this.setState({open: true, selected});
    };

    onClose = () => {
        this.setState({open: false});
    };

    selectedIndex = () => {
        let {value} = this.state;
        let {data, valueExtractor} = this.props;

        return data.findIndex(
            (item, index) => null != item && value === valueExtractor(item, index)
        );
    };

    onSelect = index => {
        let {data, valueExtractor, onChangeText} = this.props;

        let value = valueExtractor(data[index], index);

        if (typeof onChangeText === "function") {
            onChangeText(value, index, data);
        }

        setTimeout(this.onClose, 250);
    };

    selectedItem = () => {
        let {data} = this.props;

        return data[this.selectedIndex()];
    };

    keyExtractor = (item, index) => {
        let {valueExtractor} = this.props;

        return `${index}-${valueExtractor(item, index)}`;
    };

    renderBase = props => {
        let {value} = this.state;
        let {data, error, labelExtractor, placeholder} = this.props;

        let index = this.selectedIndex();
        let title;

        if (~index) {
            title = labelExtractor(data[index], index);
        }

        if (null == title) {
            title = value;
        }

        title = null == title || "string" === typeof title ? title : String(title);

        return (
            <TextInput
                pointerEvents="none"
                error={error}
                mode="outlined"
                label={placeholder}
                style={{marginVertical: 8}}
                onChangeText={undefined}
                editable={false}
                value={title}
            />
        );
    };

    renderItem = ({item, index}) => {
        let {selected} = this.state;
        let {valueExtractor, labelExtractor} = this.props;

        let value = valueExtractor(item);
        let label = labelExtractor(item);

        let title = null == label ? value : label;

        return (
            <Option
                width={this.state.width}
                index={index}
                selected={selected === index}
                {...item}
                title={title}
                onPress={this.onSelect}
            />
        );
    };

    render() {
        const {disabled, style} = this.props;
        return (
            <Menu
                visible={this.state.open}
                onDismiss={this.onClose}
                anchor={
                    <TouchableOpacity
                        onLayout={({
                                       nativeEvent: {
                                           layout: {x, y, width, height}
                                       }
                                   }) => this.setState({width})}
                        style={[style && style]}
                        onPress={!disabled ? this.onPress : null}
                    >
                        <View pointerEvents="none">{this.renderBase()}</View>
                        <List.Icon
                            icon={"arrow-drop-down"}
                            style={{position: "absolute", right: 0, bottom: 0, margin: 16}}
                        />
                    </TouchableOpacity>
                }
            >
                <FlatList
                    style={{maxHeight: 300}}
                    ItemSeparatorComponent={() => <Divider style={{marginLeft: 16}}/>}
                    data={this.props.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                />
            </Menu>
        );
    }
}
