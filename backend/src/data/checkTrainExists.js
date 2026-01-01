import pool from "./dbconn";
import dbg from "debug";
const debug = dbg("data:checkTrainExists");

const checkTrainExists = (num) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				reject({ success: false, message: "Error In connection", error: err });
			}
			connection.query(
				"SELECT * FROM train WHERE num = ?",
				[num],
				(err, result) => {
					if (err) {
						debug(err);
						reject({ success: false, message: err });
					} else {
						if (result.length > 0) {
							resolve({
								success: false,
								message: "Train Found",
							});
						} else {
							resolve({ success: true, message: "Train not found" });
						}
					}
				}
			);
			connection.release();
		});
	});
};
export default checkTrainExists;
