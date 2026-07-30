import dotenv from 'dotenv';
import Firebird from 'node-firebird';

dotenv.config();

const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.FB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const queryDatabase = (query, params = []) => {
    return new Promise((resolve, reject) => {
        Firebird.attach(options, (err, db) => {
            if (err) {
                return reject(err);
            }
            db.query(query, params, (err, result) => {
                db.detach();
                
                if (err) {
                    return reject(err);
                }else {
                    return resolve(result);
                }
            });
        });
    });
};

export { queryDatabase };