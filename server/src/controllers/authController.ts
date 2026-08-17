import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { promises } from "node:dns";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
            return;
        }

        const user = await registerUser({
            name, email, password
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        })

    } catch (error) {
        console.error("Registration error", error);
        
        if (error instanceof Error) {
      if (error.message === "Email is already registered") {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginUser({
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Login error:", error);

     if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};