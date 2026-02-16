import { getUserId } from "@/lib/auth";
import User from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";



export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {

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
        const { id } = await params;

        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    experiences: { _id: id }
                }
            },
            { new: true }
        );
        return new Response(JSON.stringify({ message: "Experience deleted successfully" }), { status: 200 });
    }
    catch (err) {
        console.error("Error deleting experience:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {


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

        const { role,
            companyName,
            location,
            dateOfJoining,
            currentlyWorking,
            dateOfLeaving,
            description } = await req.json();

        const { id } = await params;

        const updateData = await User.findOneAndUpdate(
            { _id: userId, "experiences._id": id },
            {
                $set: {
                    "experiences.$.role": role,
                    "experiences.$.companyName": companyName,
                    "experiences.$.location": location,
                    "experiences.$.dateOfJoining": dateOfJoining,
                    "experiences.$.currentlyWorking": currentlyWorking,
                    "experiences.$.dateOfLeaving": dateOfLeaving,
                    "experiences.$.description": description
                }
            },
            { new: true }
        );

        if (!updateData) {
            return new Response(
                JSON.stringify({ message: "Profile or experience not found" }),
                { status: 404 }
            );
        }

        const updatedExperience = updateData.experiences.find((exp: any) => exp._id.toString() === id);

        return new Response(JSON.stringify({ experience: updatedExperience }), { status: 200 });
    }
    catch (err) {
        console.error("Error updating experience:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

