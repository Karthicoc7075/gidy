import User from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";
import { getUserId } from "@/lib/auth";

export async function PATCH(req: Request) {
    const userId = getUserId(req);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        
        const { skills } = await req.json();
        
        const updateData = await User.findByIdAndUpdate(
            userId,
            {
                skills
            },
            { new: true }
        );
        const data = {
            skills: updateData?.skills,
        }

        return new Response(JSON.stringify({ user: data }   ), { status: 200 });
    }
        catch (err) {   
        console.error("Error updating skills:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}