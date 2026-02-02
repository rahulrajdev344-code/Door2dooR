import axios from "axios";
import config from "../../config/config";

const signupAPI = async (data) => {
	const { type, name, email, phone, password, otp } = data;
	return await axios
		.post(config.baseUrl + config.signup, {
			type,
			name,
			email,
			phone,
			password, otp
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log("Error Occured in Signup:" + err);
			return { success: false, message: "Network Error or Server Down" };
		});
};

export default signupAPI;
