import React, { useState, useEffect } from "react";
import { alertAdded, alertRemoved } from "../../store/alert";
import { useDispatch, useSelector } from "react-redux";
import Reactmap from "../CLIENT/Reactmap";
import trackRoutesAPI from "../../api/CLIENT/trackRoutesAPI";
import DataTable from "./DataTable";
import TrackColumn from "./TrackColumn";
import { useLocation } from "react-router";
import axios from "axios";
import config from "../../config/config";

function Track() {
	const auth = useSelector((state) => state.auth);
	const [trackID, setTrackID] = useState("");
	const dispatch = useDispatch();
	const [tableData, setTableData] = useState([]);
	const location = useLocation();
	const [markers, setMarkers] = useState([]);

	const validateForm = () => {
		return trackID.length > 0;
	};

	const getCoordinates = async (pincode) => {
		try {
			const res = await axios.get(config.pincodeurl + pincode + ", India");
			if (res.data && res.data.data && res.data.data.length > 0) {
				return {
					anchorLat: res.data.data[0].latitude,
					anchorLng: res.data.data[0].longitude
				};
			} else {
				// Fallback attempt without country if strict match fails?
				// Or try searching by City Name if available?
				// For now, just log.
				console.warn("No results for pincode:", pincode);
			}
		} catch (e) {
			console.error("Geocoding failed for", pincode);
		}
		return null;
	}

	const fetchTrackData = (id) => {
		trackRoutesAPI({
			token: auth.token,
			track_id: id,
		}).then(async (res) => {
			console.log(res.data.trackRoute);
			var tempData = [];
			if (res.data.trackRoute) {
				const pincodes = new Set();
				for (var i = 0; i < res.data.trackRoute.length; i++) {
					var tempRow = {};
					tempRow["srno"] = res.data.trackRoute[i]["pos"];
					tempRow["trackID"] = res.data.trackRoute[i]["track_id"];
					tempRow["src_pincode"] = res.data.trackRoute[i]["src_pincode"];
					tempRow["dest_pincode"] = res.data.trackRoute[i]["dest_pincode"];
					tempRow["distance"] = res.data.trackRoute[i]["distance"] + "km";
					tempRow["duration"] = res.data.trackRoute[i]["duration"] + "min";
					tempRow["time"] = res.data.trackRoute[i]["time"] + "min";
					tempRow["type"] = res.data.trackRoute[i]["type"];
					tempRow["cost"] = res.data.trackRoute[i]["cost"];

					tempData.push(tempRow);
					pincodes.add(res.data.trackRoute[i]["src_pincode"]);
					pincodes.add(res.data.trackRoute[i]["dest_pincode"]);
				}
				console.log(tempData);
				setTableData(tempData);

				// Fetch Coordinates for Map
				const promises = Array.from(pincodes).map(p => getCoordinates(p));
				const coords = await Promise.all(promises);
				const validCoords = coords.filter(c => c !== null);
				if (validCoords.length > 0) {
					setMarkers(validCoords);
				}
			}
		});
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		if (validateForm()) {
			fetchTrackData(trackID);
		} else {
			dispatch(
				alertAdded({
					variant: "warning",
					message: "Enter Correct Tracking ID.",
				})
			);
		}
	};

	useEffect(() => {
		if (location.state && location.state.rowData && location.state.rowData.courierId) {
			const id = location.state.rowData.courierId;
			setTrackID(id);
			fetchTrackData(id);
		}
	}, [location.state]);

	return (
		<div>
			<div className='row'>
				<label>Tracking Id:</label>
				<input value={trackID} onChange={(e) => setTrackID(e.target.value)} />
			</div>
			<div id='button' class='row'>
				<button
					style={{ width: "45%", fontSize: "15px" }}
					onClick={handleSubmit}
				>
					Submit
				</button>
			</div>
			<DataTable
				columns={TrackColumn}
				data={tableData}
			/>
			<div style={{ width: "200vw", height: "200vh" }}>
				<Reactmap markers={markers} defaultLat={20.5937} defaultLng={78.9629} />
			</div>
		</div>
	);
}
// Default Lat/Lng changed to India Center (approx)

export default Track;
