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
        
        const {  role,
  companyName,
  location,
  dateOfJoining,
  dateOfLeaving,
  currentlyWorking } = await req.json();

        const updateData = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    experiences: {
                        role,
                        companyName,
                        location,
                        dateOfJoining,
                        dateOfLeaving,
                        currentlyWorking
                    }
                }
            },
            { new: true }
        );  

        return new Response(JSON.stringify({experience: updateData.experiences[updateData.experiences.length - 1]}), { status: 200 });
    }
        catch (err) {   
        console.error("Error updating experience:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
