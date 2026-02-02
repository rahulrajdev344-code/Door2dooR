import React, { useEffect, useState } from "react";
import historytablecolumns from "./historytablecolumn";
import DataTable from "../COMMON/DataTable";
import historyAPI from "../../api/CLIENT/historyAPI";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../store/auth";
import moment from "moment";

function History() {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        dispatch(setLoading({ loading: true }));
        historyAPI(auth.token).then((res) => {
            if (res && res.success) {
                const formattedData = res.data.map((item, index) => ({
                    srno: index + 1,
                    courierId: item.track_id, // Shorten?
                    source: item.src_pincode,
                    destination: item.dest_pincode,
                    departure: moment(item.created_at).format("DD-MM-YYYY"),
                    arrival: item.status === "delivered" ? moment(item.updated_at).format("DD-MM-YYYY") : "Pending",
                    estimated_Time: item.total_duration ? Math.round(item.total_duration) + " min" : "-",
                    actual_Time: "-",
                    cost: item.total_cost ? "Rs. " + item.total_cost : "-",
                    track: item.status
                }));
                setTableData(formattedData);
            }
            dispatch(setLoading({ loading: false }));
        });
    }, [auth.token, dispatch]);

    return (
        <DataTable
            columns={historytablecolumns}
            data={tableData}
            onclicklink={"/client/track"}
        />
    );
}

export default History;