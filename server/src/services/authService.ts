import pool from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData) => {
    const {name, email, password} = data;

    const existingUser = await pool.query(
        `SELECT id FROM users WHERE email = $1`, [email]
    );

    if(existingUser.rows.length > 0){
        throw new Error("Email is already registered.")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id,name,email,role, created_at`, [name, email, hashedPassword]
    );
    return result.rows[0];

};

export const loginUser = async (data:LoginData) => {
    const {email, password} = data;

    //find user
    const result = await pool.query(
        `SELECT id, name, email, password, role FROM users WHERE email = $1`, [email]
    )

    if(result.rows.length === 0){
        throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    //compare password
    const pwResult = await bcrypt.compare(password, user.password);

    if (!pwResult) {
        throw new Error("Invalid email or password");
    }

    //get jwt secret
    const jwtSecret = process.env.JWT_TOKEN;

    if(!jwtSecret){
        throw new Error("jwt secret is not configured");
    }

    //generate jwt
    const token = jwt.sign({
        userId: user.id,
        role: user.role
    },
    jwtSecret,
    {
        expiresIn: "1d",
    }
);

//dont return password
return {
    token,
    user:{
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
    }
}
}