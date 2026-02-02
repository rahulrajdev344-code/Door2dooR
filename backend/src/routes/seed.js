import { Router } from "express";
const router = Router();
import pool from "../data/dbconn";

router.get("/seed", async (req, res) => {
    const queries = [
        "SET FOREIGN_KEY_CHECKS = 0;",
        "TRUNCATE TABLE railStation;",
        "TRUNCATE TABLE airport;",
        "TRUNCATE TABLE train;",
        "TRUNCATE TABLE flight;",
        "TRUNCATE TABLE trainSchedule;",
        "TRUNCATE TABLE flightSchedule;",
        "TRUNCATE TABLE edges;",
        "DROP TABLE IF EXISTS trackRoute;",
        "DROP TABLE IF EXISTS track;",

        `CREATE TABLE track (
            track_id VARCHAR(255) PRIMARY KEY,
            client_id INT,
            src_pincode VARCHAR(20),
            dest_pincode VARCHAR(20),
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,

        `CREATE TABLE trackRoute (
            id INT AUTO_INCREMENT PRIMARY KEY,
            track_id VARCHAR(255),
            pos INT,
            type INT,
            distance DECIMAL(10,2),
            duration DECIMAL(10,2),
            time DECIMAL(10,2),
            cost DECIMAL(10,2),
            src_pincode VARCHAR(20),
            dest_pincode VARCHAR(20),
            FOREIGN KEY (track_id) REFERENCES track(track_id) ON DELETE CASCADE
        );`,

        "SET FOREIGN_KEY_CHECKS = 1;",

        `INSERT INTO railStation (code, name, pincode, lat, lng) VALUES
    ('NDLS', 'New Delhi', '110001', 28.6139, 77.2090),
    ('SBC', 'Bangalore City', '560023', 12.9716, 77.5946),
    ('HWH', 'Howrah Junction', '700001', 22.5851, 88.3468),
    ('CSTM', 'Mumbai CST', '400001', 18.9402, 72.8356);`,

        `INSERT INTO airport (code, name, pincode, lat, lng) VALUES
    ('DEL', 'Indira Gandhi International Airport', '110037', 28.5562, 77.1000),
    ('BLR', 'Kempegowda International Airport', '560300', 13.1986, 77.7066),
    ('BOM', 'Chhatrapati Shivaji Maharaj International Airport', '400099', 19.0896, 72.8656),
    ('CCU', 'Netaji Subhash Chandra Bose International Airport', '700052', 22.6548, 88.4467);`,

        `INSERT INTO train (num, name) VALUES ('12627', 'Karnataka Express'), ('12301', 'Howrah Rajdhani');`,
        `INSERT INTO flight (num, name) VALUES ('AI-501', 'Air India DEL-BLR'), ('AI-101', 'Air India DEL-BOM');`,

        `INSERT INTO edges (src, dest, type, num, cost, time, distance) VALUES
    ('SBC', 'NDLS', 'train', '12627', 1500, 2260, 2400),
    ('HWH', 'NDLS', 'train', '12301', 2000, 1030, 1450),
    ('DEL', 'BLR', 'flight', 'AI-501', 5000, 180, 1740),
    ('DEL', 'BOM', 'flight', 'AI-101', 3000, 120, 1150);`,

        `INSERT INTO trainSchedule (num, code, arrival, departure, pos, day, distance) VALUES
    ('12627', 'SBC', '19:20:00', '19:20:00', 1, 1, 0),
    ('12627', 'NDLS', '09:00:00', '09:00:00', 2, 3, 2400),
    ('12301', 'HWH', '16:50:00', '16:50:00', 1, 1, 0),
    ('12301', 'NDLS', '10:00:00', '10:00:00', 2, 2, 1450);`,

        `INSERT INTO flightSchedule (num, code, arrival, departure, pos, day, distance) VALUES
    ('AI-501', 'DEL', '10:00:00', '10:00:00', 1, 1, 0),
    ('AI-501', 'BLR', '13:00:00', '13:00:00', 2, 1, 1740),
    ('AI-101', 'DEL', '08:00:00', '08:00:00', 1, 1, 0),
    ('AI-101', 'BOM', '10:00:00', '10:00:00', 2, 1, 1150);`
    ];

    try {
        for (const query of queries) {
            await new Promise((resolve, reject) => {
                pool.query(query, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        }
        res.send({ success: true, message: "Database Seeded Successfully! You can now search for routes." });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message, error });
    }
});

export default router;
