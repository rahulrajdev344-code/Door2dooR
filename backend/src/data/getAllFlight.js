import pool from "./dbconn";
import dbg from "debug";

const debug = dbg("data:getAllFlight");
const getAllFlight = () => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				reject({ success: false, message: "Error In connection", error: err });
			}
			connection.query(
				"SELECT e.*, fs.arrival,fs.departure,fs.distance, fs.pos,fs.day,ar.pincode as src_pincode,ar2.pincode as dest_pincode FROM edges e\
                JOIN flightSchedule fs ON e.src=fs.code AND fs.num=e.num\
                JOIN airport ar ON e.src = ar.code\
                JOIN airport ar2 ON e.dest = ar2.code\
                ",
				(err, result) => {
					if (err) {
						reject({ success: false, message: err });
					}
					resolve({ success: true, data: { flight: result } });
				}
			);

			connection.release();
		});
	});
};
export default getAllFlight;
