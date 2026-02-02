import pool from "./dbconn";
import dbg from "debug";
const debug = dbg("data:checkIfUserExists");

const checkIfUserExists = ({ type, phone }) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				reject({ success: false, message: "Error In connection", error: err });
				return;
			}
			const tableName = type === "client" ? "user" : type;
			connection.query(
				"SELECT * FROM ?? WHERE phone = ?",
				[tableName, phone],
				(err, result) => {
					connection.release();
					if (err) {
						debug(err);
						reject({ success: false, message: err });
					} else {
						if (result.length > 0) {
							resolve({
								success: true,
								message: "User Found",
								data: { user: result[0] },
							});
						} else {
							resolve({ success: false, message: "User not found" });
						}
					}
				}
			);
		});
	});
};
export default checkIfUserExists;
