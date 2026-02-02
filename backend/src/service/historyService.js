import dbg from "debug";
const debug = dbg("service:historyService");
import checkToken from "../controllers/checkToken";
import getHistory from "../data/getHistory";

const historyService = async (token) => {
    return await checkToken(token)
        .then((response) => {
            return getHistory(response.data.decoded.user_id);
        })
        .catch((err) => {
            debug(err);
            return err;
        });
};

export default historyService;
