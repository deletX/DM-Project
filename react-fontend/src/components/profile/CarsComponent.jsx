import React, {Component, forwardRef} from 'react';
import {connect} from 'react-redux';
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {createCar, deleteCar, updateCar} from "../../actions/profileActions";
import {withWidth} from "@material-ui/core";
import {withSnackbar} from "notistack";

/**
 * Icons for the table (wasn't working by default).
 *
 * See {@link https://github.com/mbrn/material-table/issues/51#issuecomment-508384214}
 */
const tableIcons = {
    Add:
        forwardRef((props, ref) =>
            <AddBox {...props} ref={ref}/>
        ),
    Check:
        forwardRef((props, ref) =>
            <Check {...props} ref={ref}/>),
    Clear:
        forwardRef((props, ref) =>
            <Clear {...props} ref={ref}/>),
    Delete:
        forwardRef((props, ref) =>
            <DeleteOutline {...props} ref={ref}/>),
    DetailPanel:
        forwardRef((props, ref) =>
            <ChevronRight {...props} ref={ref}/>),
    Edit:
        forwardRef((props, ref) =>
            <Edit {...props} ref={ref}/>),
    Export:
        forwardRef((props, ref) =>
            <SaveAlt {...props} ref={ref}/>),
    Filter:
        forwardRef((props, ref) =>
            <FilterList {...props} ref={ref}/>),
    FirstPage:
        forwardRef((props, ref) =>
            <FirstPage {...props} ref={ref}/>),
    LastPage:
        forwardRef((props, ref) =>
            <LastPage {...props} ref={ref}/>),
    NextPage:
        forwardRef((props, ref) =>
            <ChevronRight {...props} ref={ref}/>),
    PreviousPage:
        forwardRef((props, ref) =>
            <ChevronLeft {...props} ref={ref}/>),
    ResetSearch:
        forwardRef((props, ref) =>
            <Clear {...props} ref={ref}/>),
    Search:
        forwardRef((props, ref) =>
            <Search {...props} ref={ref}/>),
    SortArrow:
        forwardRef((props, ref) =>
            <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck:
        forwardRef((props, ref) =>
            <Remove {...props} ref={ref}/>),
    ViewColumn:
        forwardRef((props, ref) =>
            <ViewColumn {...props} ref={ref}/>)
};

/**
 * A table (see {@link https://material-table.com/}) that contains all user's cars and enable creation, editing and
 * deletion of a car.
 */
class CarsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cars: props.profile.carSet
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            cars: props.profile.carSet,
        }
    }

    render() {
        const widthStyle = this.props.width === "xs" ? "95vw" : "100%"

        return (
            <div style={{width: widthStyle}}>
                <MaterialTable
                    style={{backgroundColor: "white", width: "100%", maxWidth: "560px"}}
                    icons={tableIcons}
                    title="Cars"
                    columns={[
                        {
                            title: "Name", field: 'name', sorting: true,
                            render: (rowData) => (
                                <div
                                    title={rowData.name}
                                    style={{
                                        maxWidth: "10ch",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}>
                                    {rowData.name}
                                </div>)
                        },
                        {
                            title: "Seats",
                            field: 'tot_avail_seats',
                            initialEditValue: 4,
                            sorting: false,
                            lookup: {
                                2: "2",
                                3: "3",
                                4: "4",
                                5: "5",
                                6: "6",
                                7: "7",
                                8: "8",
                                9: "9",

                            },
                        },
                        {
                            title: "Fuel",
                            field: 'fuel',
                            lookup: {
                                1: "Petrol",
                                2: "Diesel",
                                3: "Gas",
                                4: "Electric",
                            },
                            initialEditValue: 1,
                            cellStyle: {
                                maxWidth: "5ch",
                            }
                        },
                        {
                            title: "l/100km", field: 'consumption', initialEditValue: 10, type: "numeric",
                        }
                    ]}
                    options={{
                        search: false,
                        paging: false,
                        draggable: false,
                        doubleHorizontalScroll: true,
                        headerStyle: {
                            backgroundColor: "white",
                            maxWidth: "15ch",
                        }
                    }}
                    data={this.state.cars}
                    editable={{
                        onRowAdd:
                            newData =>
                                new Promise((resolve, reject) => {
                                    const {name, tot_avail_seats, consumption, fuel} = newData
                                    if (name === undefined || tot_avail_seats < 2 || tot_avail_seats > 9 || consumption <= 0)
                                        reject()
                                    else {
                                        this.props.createCar(name, tot_avail_seats, consumption, fuel, this.props.enqueueSnackbar)
                                        resolve();
                                    }
                                }),
                        onRowUpdate:
                            (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    const {name, tot_avail_seats, consumption, fuel} = newData
                                    if (name === "" || tot_avail_seats < 2 || tot_avail_seats > 9 || consumption <= 0)
                                        reject()
                                    else {
                                        this.props.updateCar(oldData.id, name, tot_avail_seats, consumption, fuel, this.props.enqueueSnackbar)
                                        resolve();
                                    }
                                }),
                        onRowDelete:
                            oldData =>
                                new Promise((resolve, reject) => {
                                    this.props.deleteCar(oldData.id, this.props.enqueueSnackbar)
                                    resolve();
                                })
                    }}
                />
            </div>
        )
    }
    ;
}

function mapStateToProps(state) {
    return {
        profile: state.profile,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createCar: (name, seats, consumption, fuel, resolve, enqueueSnackbar) => dispatch(createCar(name, seats, fuel, consumption, resolve, enqueueSnackbar)),
        deleteCar: (id, enqueueSnackbar, resolve) => dispatch(deleteCar(id, enqueueSnackbar, resolve)),
        updateCar: (id, name, seats, consumption, fuel, enqueueSnackbar) => dispatch(updateCar(id, name, seats, fuel, consumption, enqueueSnackbar))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withWidth()(withSnackbar(CarsComponent)));