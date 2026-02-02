import axios from "axios";
import config from "../../config/config";

const historyAPI = async (token) => {
    return await axios
        .get(config.baseUrl + "/history", {
            headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
            return { success: false, message: err.message };
        });
};

export default historyAPI;
