import userModel from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }

        await dbConnect();
        const user = await userModel.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

        if (!user.onboardingCompleted) {
            return new Response(JSON.stringify({ data: { token, onboardingCompleted: user.onboardingCompleted || false, email: user.email, _id: user._id } }), { status: 200 });
        }
        return new Response(JSON.stringify({
            data: {
                token,
                onboardingCompleted: true,
                email: user.email,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePictureUrl: user.profilePictureUrl,
                descriptionType: user.descriptionType
            }
        }), { status: 200 });
    } catch (err) {
        console.error("Signin error:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
