const pool = require('./db');
const writeLog = require('../../logs/log_handler');

class user {
    constructor({id = 0, email = null, password = null, dbResult = null}) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.dbResult = dbResult;
    }

    set setUserID(id) {
        this.id = id;
    }

    set setUserEmail(email) {
        this.email = email;
    }

    set setUserPW(password) {
        this.password = password;
    }

    set setUserDbResult(dbResult) {
        this.dbResult = dbResult;
    }

    get getUserDbResult() {
        return this.dbResult;
    }


    async createUser() {
        try {
            if (this.email == null || this.email === "" || typeof (this.email) != "string" || this.password == null || this.password === "" || typeof (this.password) != "string") {
                throw `Entrada incorreta em createUser\n:email:${this.email} typeof: ${typeof (this.email)}\nnpassword:${this.password} typeof: ${typeof (this.password)})}`;
            } else {
                const query = `insert into users (user_email, user_password) values ($1,$2) returning *`;
                const values = [this.email, this.password];
                const response = await pool.query(query, values);
                this.setUserDbResult = response;
                if (response.rowCount == 0) {
                    throw `Resposta ruim, provavelmente não encontrou o que você estava procurando\nResposta:\n${JSON.stringify(response)}\n` + JSON.stringify(response.rows[0]);
                }
                writeLog("\nUsuário criado com sucesso\nID: " + this.dbResult.rows[0].user_id);
                return this.dbResult.rowCount;
            }
        } catch (err) {
            writeLog("\nErro em createUser\n" + err);
        }
    }

    async deleteUser() {
        try {
            if (this.id == null || typeof (this.id) != "number") {
                throw `Entrada incorreta em deleteUser\nID: ${this.id} typeof: ${typeof (this.id)}`;
            } else {
                const query = `delete from users where user_id = $1 returning *`;
                const values = [this.id];
                const response = await pool.query(query, values);
                this.setUserDbResult = response;
                if (response.rowCount == 0) {
                    throw `Resposta ruim, provavelmente não encontrou o que você estava procurando\nResposta:\n${JSON.stringify(response)}\n` + JSON.stringify(response.rows[0]);
                }
                writeLog("\nSucesso em deletar um usuário\nID: " + this.dbResult.rows[0].user_id);
            }
        } catch (err) {
            writeLog("\nErro em deleteUser\n" + err);
        }
    }

    async getUser() {
        try {
            if (this.id === undefined || typeof (this.id) != "number") {
                throw `Entrada incorreta em getUser\nid: ${this.id} typeOf: ${typeof (this.id)}`;
            } else if (this.id === 0) {
                const query = `select * from users`;
                const response = await pool.query(query);
                this.setUserDbResult = response;
                let regex = /\{/ig;
                if (response.rowCount == 0) {
                    throw `Resposta ruim, provavelmente não encontrou o que você estava procurando\nResposta:\n${JSON.stringify(response)}\n` + JSON.stringify(response.rows[0]);
                }
                writeLog("\nUsuários no sistema:\n" + JSON.stringify(this.dbResult.rows).replace(regex, "\n"));

            } else {
                const query = `select * from users where user_id = $1`;
                const values = [this.id];
                const response = await pool.query(query, values);
                this.setUserDbResult = response;
                if (response.rowCount == 0) {
                    throw `Resposta ruim, provavelmente não encontrou o que você estava procurando\nResposta:\n${JSON.stringify(response)}\n` + JSON.stringify(response.rows[0]);
                }
                writeLog("\nDados do usuário de ID " + this.dbResult.rows[0].user_id + ":\n" + JSON.stringify(rhis.dbResult.rows[0]));
            }
        } catch (err) {
            writeLog("\nErro em getUser\n" + err);
        }
    }

    async logUser() {
        try {
            if (this.email == undefined || typeof (this.email) != "string" || this.password == undefined || typeof (this.password) != "string") {
                throw `Erro de entrada em logUser\nemail: ${this.email} typeof: ${typeof (this.email)}\npassword: ${this.password} typeof: ${typeof (this.password)}`
            } else {
                const query = `select * from users where user_email = $1 and user_password = $2`;
                const values = [this.email, this.password];
                const response = await pool.query(query, values);
                this.setUserDbResult = response
                if (response.rowCount == 0) {
                    throw `Resposta ruim, provavelmente não encontrou o que você estava procurando\nResposta:\n${JSON.stringify(response)}\n` + JSON.stringify(response.rows[0]);
                }
                writeLog("\nUsuário logado com sucesso\nID:" + this.dbResult.rows[0].user_id);
                return this.dbResult;
            }
        } catch (err) {
            writeLog("\nErro em logUser\n" + err);
        }
    }
}

module.exports = user;