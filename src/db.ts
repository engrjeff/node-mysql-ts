import mysql, { OkPacket, QueryOptions } from 'mysql2';

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
});

interface DBClient {
  query: <T>(sql: string, values?: any) => Promise<T[]>;
  getAll: <T>(tableName: string) => Promise<T[]>;
  findById: <T>(tableName: string, id: string | number) => Promise<T | null>;
  create: <T extends {}>(tableName: string, data: T) => Promise<T>;
  update: <T extends {}>(tableName: string, id: string, data: T) => Promise<T>;
  remove: (tableName: string, id: number | string) => Promise<{ affectedRows: number }>;
}

export const dbClient: DBClient = {
  query<T>(sql: string, values?: any) {
    return new Promise<T[]>((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result as T[]);
      });
    });
  },
  getAll<T>(tableName: string) {
    return new Promise<T[]>((resolve, reject) => {
      db.query(`SELECT * FROM ${tableName}`, (err, result) => {
        if (err) reject(err);
        else resolve(result as T[]);
      });
    });
  },
  findById<T>(tableName: string, id: string | number) {
    return new Promise<T | null>((resolve, reject) => {
      db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, result) => {
        if (err) reject(err);
        else {
          const res = Array.isArray(result) ? result[0] : null;

          resolve(res as T);
        }
      });
    });
  },
  create<T extends {}>(tableName: string, data: T) {
    return new Promise<T>((resolve, reject) => {
      db.query<OkPacket>(
        `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES(${Object.keys(data)
          .map((d) => '?')
          .join(', ')})`,
        [...Object.values(data)],
        (err, result) => {
          if (err) reject(err);
          else
            this.findById(tableName, result.insertId)
              .then((insertedData) => resolve(insertedData as T))
              .catch(reject);
        }
      );
    });
  },
  update<T extends {}>(tableName: string, id: string, data: T) {
    return new Promise<T>((resolve, reject) => {
      db.query<OkPacket>(
        `UPDATE ${tableName} SET ${Object.keys(data)
          .map((key, idx) => (idx === Object.keys(data).length - 1 ? `${key} = ?` : `${key} = ?,`))
          .join('')} WHERE id = ?`,
        [...Object.values(data), id],
        (err, result) => {
          if (err) reject(err);
          else
            this.findById(tableName, id)
              .then((updatedData) => resolve(updatedData as T))
              .catch(reject);
        }
      );
    });
  },
  remove(tableName: string, id: number | string) {
    return new Promise<{ affectedRows: number }>((resolve, reject) => {
      db.query<OkPacket>(`DELETE FROM ${tableName} WHERE id = ?`, [id], (err, res) => {
        if (err) reject(err);
        else resolve({ affectedRows: res.affectedRows });
      });
    });
  },
};
