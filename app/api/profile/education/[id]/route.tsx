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
                    education: { _id: id }
                }
            },
            { new: true }
        );
        return new Response(JSON.stringify({ message: "Education deleted successfully" }), { status: 200 });
    }
    catch (err) {
        console.error("Error deleting education:", err);
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

        const { college,
            degree,
            fieldOfStudy,
            location,
            dateOfJoining,
            currentlyStudying,
            dateOfCompletion } = await req.json();

        const { id } = await params;

        const updateData = await User.findOneAndUpdate(
            { _id: userId, "education._id": id },
            {
                $set: {
                    "education.$.college": college,
                    "education.$.degree": degree,
                    "education.$.fieldOfStudy": fieldOfStudy,
                    "education.$.dateOfJoining": dateOfJoining,
                    "education.$.dateOfCompletion": dateOfCompletion,
                    "education.$.currentlyStudying": currentlyStudying,
                    "education.$.location": location
                }
            },
            { new: true }
        );
        const updatedEducation = updateData.education.find((e: any) => e._id.toString() === id);
        return new Response(JSON.stringify({ education: updatedEducation }), { status: 200 });
    }
    catch (err) {
        console.error("Error updating education:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
