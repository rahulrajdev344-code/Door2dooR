import pool from "./dbconn";
import dbg from "debug";

const debug = dbg("data:addNewUser");
const addNewUser = async (user) => {
	return new Promise((resolve, reject) => {
		var values;
		if (user.type === "admin") {
			values = {
				email: user.email,
				phone: user.phone,
				password: user.password,
			};
		} else {
			values = {
				name: user.name,
				email: user.email,
				phone: user.phone,
				password: user.password,
			};
		}
		pool.getConnection((err, connection) => {
			if (err) {
				reject({ success: false, message: "Error In connection", error: err });
				return;
			}
			const tableName = user.type === "client" ? "user" : user.type;
			connection.query(
				"INSERT INTO ?? set ?",
				[tableName, values],
				(err, result) => {
					connection.release();
					if (err) {
						reject({ success: false, message: err });
					} else resolve({ success: true, message: result, user: user });
				}
			);
		});
	});
};
export default addNewUser;
