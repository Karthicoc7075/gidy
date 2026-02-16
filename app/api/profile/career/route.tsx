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
        
        const { descriptionType, careerVision } = await req.json();

        const updateData = await User.findByIdAndUpdate(
            userId,
            {
              $set:{
                  descriptionType,
                careerVision: {
                    longTermAspiration: careerVision.longTermAspiration,
                    aspirationalField: careerVision.aspirationalField,
                    inspiration: careerVision.inspiration,
                    currentGoal: careerVision.currentGoal
                }
              }
            },
           { new: true, runValidators: true }
        );  
        
        const data = {
            descriptionType: updateData?.descriptionType,
            careerVision: updateData?.careerVision
        }

        return new Response(JSON.stringify( data ), { status: 200 });
    }
        catch (err) {   
        console.error("Error updating career:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }       
}