import userModel from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }

        await dbConnect();

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "Email already in use" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

        return new Response(JSON.stringify({ data: { _id: newUser._id, email: newUser.email, token } }), { status: 201 });
    } catch (err) {
        console.error("Signup error:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
} 