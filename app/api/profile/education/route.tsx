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
        
        const { college,
  degree,
  fieldOfStudy,
  location,
  dateOfJoining,
  currentlyStudying,
  dateOfCompletion} = await req.json();

            if(!college || !degree || !fieldOfStudy || !dateOfJoining ){
                return new Response(JSON.stringify({ error: "Validation error: Missing required fields" }), { status: 400 });
            }

        const updateData = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    education: {
                        college,
                        degree,
                        fieldOfStudy,
                        location,
                        dateOfJoining,
                        currentlyStudying,
                        dateOfCompletion
                    }
                }
            },
            { new: true }
        );  
        
        
        return new Response(JSON.stringify({education: updateData.education[updateData.education.length - 1]}), { status: 200 });

    }
        catch (err) {   
        console.error("Error updating education:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
