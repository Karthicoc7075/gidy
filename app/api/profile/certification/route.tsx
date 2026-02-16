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
        
        const {   certification,
  provider,
  certificateUrl,
  certificateId,
  issueDate,
  expiryDate,
  description } = await req.json();

        const updateData = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    certifications: {
                        certification,
                        provider,
                        certificateUrl,
                        certificateId,
                        issueDate,
                        expiryDate,
                        description
                    }
                }
            },
            { new: true }
        );
        return new Response(JSON.stringify({certification: updateData.certifications[updateData.certifications.length - 1]}), { status: 200 });
    }
        catch (err) {   
        console.error("Error updating certification:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

