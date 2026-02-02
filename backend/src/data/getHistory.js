import pool from "./dbconn";
import dbg from "debug";

const debug = dbg("data:getHistory");

const getHistory = (client_id) => {
    return new Promise((resolve, reject) => {
        // Retrieve Tracks with Aggregated Cost and Duration
        const query = `
            SELECT 
                t.track_id, 
                t.src_pincode, 
                t.dest_pincode, 
                t.status, 
                t.created_at, 
                SUM(tr.cost) as total_cost, 
                SUM(tr.duration) as total_duration 
            FROM track t 
            LEFT JOIN trackRoute tr ON t.track_id = tr.track_id 
            WHERE t.client_id = ? 
            GROUP BY t.track_id 
            ORDER BY t.created_at DESC
        `;

        pool.query(
            query,
            [client_id],
            (err, result) => {
                if (err) {
                    reject({ success: false, message: err });
                } else {
                    resolve({ success: true, data: result });
                }
            }
        );
    });
};

export default getHistory;
