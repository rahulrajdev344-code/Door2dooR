import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import DataTable from "../COMMON/DataTable";
import tableColumns from "./RouteDetailsColumn";
import Reactmap from "./Reactmap";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/auth";
import bookRouteAPI from "../../api/CLIENT/bookRouteAPI";
import pincode from "pincode-lat-long";
import pintocity from "../../api/COMMON/pintocity";
import PintoCordinates from "../../api/COMMON/pintoCordinates";
import moment from "moment";

function RouteDetails(props) {
	const auth = useSelector((state) => state.auth);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [tableData, setTableData] = useState([]);

	const routeDetails = location.state?.data?.[location.state?.idx - 1];
	const markers = location.state?.markersGrp?.[location.state?.idx - 1] || [];

	console.log(routeDetails, location.state?.idx);
	console.log(markers);

	useEffect(() => {
		if (!routeDetails) return;
		dispatch(setLoading({ loading: true }));
		var tempData = [];
		for (var i = 0; i < routeDetails.length; i++) {
			var tempRow = {};
			tempRow["srno"] = i + 1;
			tempRow["source"] = routeDetails[i].src_pincode;
			tempRow["destination"] = routeDetails[i].dest_pincode;
			tempRow["trainFlightRoad"] =
				routeDetails[i].type === 0
					? "Train"
					: routeDetails[i].type === 1
						? "Flight"
						: "Roadways";
			tempRow["distance"] = routeDetails[i].distance + "km";
			tempRow["duration"] = routeDetails[i].duration;
			tempRow["time"] = routeDetails[i].time;
			tempRow["cost"] = "Rs." + routeDetails[i].cost;
			tempData.push(tempRow);
		}
		setTableData(tempData);
		dispatch(setLoading({ loading: false }));
	}, [routeDetails, dispatch]);

	const handleBook = () => {
		if (routeDetails) {
			bookRouteAPI({ token: auth.token, path: routeDetails }).then((response) => {
				if (response && response.success) {
					alert("Route Booked Successfully! You can track it now.");
					navigate("/client/track");
				} else {
					alert("Booking Failed: " + (response && response.message ? response.message : "Network Error"));
				}
			});
		}
	};

	// Safety check to prevent crash on refresh
	if (!location.state || !routeDetails) {
		return <div className="p-4 text-center">No route data available. Please search again.</div>;
	}

	return (
		<div>
			{console.log(routeDetails)}
			<div className='row'>
				<label>Source</label>
				<input value={location.state.source} />
			</div>

			<div className='row'>
				<label>Destination</label>
				<input value={location.state.destination} />
			</div>

			<div className='row'>
				<label>Cost</label>
				<input value={location.state.cost} />
			</div>

			<div className='row'>
				<label>Duration</label>
				<input value={location.state.duration} />
			</div>

			<DataTable
				columns={tableColumns}
				data={tableData}
				onclicklink={"/client/route-details"}
			/>
			<div id='button' class='row'>
				<button style={{ width: "45%", fontSize: "15px" }} onClick={handleBook}>
					Book
				</button>
			</div>
			<div style={{ width: "200vw", height: "auto" }}>
				<Reactmap
					markers={markers}
					defaultLat={markers[0]?.anchorLat || 20.5937}
					defaultLng={markers[0]?.anchorLng || 78.9629}
				/>
			</div>
		</div>
	);
}

export default RouteDetails;
