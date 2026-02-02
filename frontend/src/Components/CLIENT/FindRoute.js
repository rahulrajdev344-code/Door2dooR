import React, { useState } from "react";
import { Form, Modal, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { alertAdded, alertRemoved } from "../../store/alert";
import DataTable from "../COMMON/DataTable";
import tableColumns from "./RouteTableColumns";
import { setLoading } from "../../store/auth";
import findRoutesAPI from "../../api/CLIENT/findRoutesAPI";
import axios from "axios";
import config from "../../config/config";

function FindRoute() {
	const [src_pincode, setSrcPincode] = useState("");
	const [dest_pincode, setDestPincode] = useState("");
	const [startDate, setStartDate] = useState(new Date());
	const [tableData, setTableData] = useState([]);
	const [resData, setResData] = useState([]);
	const dispatch = useDispatch();
	const [openPopup, setopenPopup] = useState(false);
	const handleClose = () => setopenPopup(false);
	const alert = useSelector((state) => state.alert);
	const auth = useSelector((state) => state.auth);
	const [markersGrp, setMarkersGrp] = useState([]);

	const validateForm = () => {
		return src_pincode.length > 0 && dest_pincode.length > 0;
	};

	const getCoordinates = async (pincode) => {
		try {
			const query = encodeURIComponent(pincode + ", India");
			const res = await axios.get(config.pincodeurl + query);
			if (res.data && res.data.data && res.data.data.length > 0) {
				return {
					anchorLat: res.data.data[0].latitude,
					anchorLng: res.data.data[0].longitude
				};
			}
		} catch (e) {
			console.error("Geocoding failed for", pincode);
		}
		return null;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (validateForm()) {
			console.log("button clicked");
			dispatch(setLoading({ loading: true }));

			try {
				const res = await findRoutesAPI({
					src_pincode: src_pincode,
					dest_pincode: dest_pincode,
					token: auth.token,
				});

				console.log(res);
				var tempData = [];
				var tempMarkersGrp = [];

				// res is paths array
				if (res && res.length > 0) {
					for (var i = 0; i < res.length; i++) { // Each Path
						var tempRow = {};
						tempRow["srno"] = i + 1;
						tempRow["source"] = src_pincode;
						tempRow["destination"] = dest_pincode;

						var cost = 0;
						const pathMarkers = [];
						const path = res[i];

						// Collect Pincodes for this path
						const pincodes = new Set();
						for (var j = 0; j < path.length; j++) {
							cost += path[j]["cost"];
							pincodes.add(path[j].src_pincode);
							pincodes.add(path[j].dest_pincode);
						}

						// Geocode all unique pincodes for this path
						const promises = Array.from(pincodes).map(p => getCoordinates(p));
						const coords = await Promise.all(promises);
						// Filter nulls
						coords.forEach(c => {
							if (c) pathMarkers.push(c);
						});

						tempMarkersGrp.push(pathMarkers);
						tempRow["cost"] = "Rs" + cost.toFixed(2);
						// Assuming last segment has total time? Or sum? 
						// Previous logic used last segment time. Retaining that.
						tempRow["duration"] = path[path.length - 1]["time"] + "min";
						tempData.push(tempRow);
					}
					setTableData(tempData);
					setMarkersGrp(tempMarkersGrp);
					setResData(res);
					setopenPopup(true);
				} else {
					dispatch(alertAdded({ variant: "warning", message: "No routes found." }));
				}

			} catch (err) {
				console.error(err);
				// alert(err.message); 
				// Use alertAdded?
			} finally {
				dispatch(setLoading({ loading: false }));
			}

		} else {
			dispatch(
				alertAdded({
					variant: "warning",
					message: "Check the entered data.",
				})
			);
		}
	};

	return (
		<div>
			<Form onSubmit={handleSubmit}>
				<div className='row'>
					<label>Source Postal Code</label>
					<input
						value={src_pincode}
						onChange={(e) => setSrcPincode(e.target.value)}
					/>
				</div>

				<div className='row'>
					<label>Destination Postal Code</label>
					<input
						value={dest_pincode}
						onChange={(e) => setDestPincode(e.target.value)}
					/>
				</div>
				<div id='button' class='row'>
					<button
						style={{ width: "45%", fontSize: "15px" }}
						type='submit'
						disabled={!validateForm()}
					>
						Search
					</button>
				</div>
			</Form>
			<DataTable
				columns={tableColumns}
				data={tableData}
				onclicklink={"/client/route-details"}
				resData={resData}
				markersGrp={markersGrp}
			/>
		</div>
	);
}

export default FindRoute;
