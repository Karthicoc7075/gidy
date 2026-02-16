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
                    certifications: { _id: id }
                }
            },
            { new: true }
        );
        return new Response(JSON.stringify({ message: "Certification deleted successfully" }), { status: 200 });
    }
    catch (err) {
        console.error("Error deleting certification:", err);
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

        const { certification,
            provider,
            certificateUrl,
            certificateId,
            issueDate,
            expiryDate,
            description } = await req.json();

        const { id } = await params;

        const updateData = await User.findOneAndUpdate(
            { _id: userId, "certifications._id": id },
            {
                $set: {
                    "certifications.$.certification": certification,
                    "certifications.$.provider": provider,
                    "certifications.$.certificateUrl": certificateUrl,
                    "certifications.$.certificateId": certificateId,
                    "certifications.$.issueDate": issueDate,
                    "certifications.$.expiryDate": expiryDate,
                    "certifications.$.description": description
                }
            },
            { new: true }
        );
        const updatedCertification = updateData.certifications.find((c: any) => c._id.toString() === id);
        return new Response(JSON.stringify({ certification: updatedCertification }), { status: 200 });
    }
    catch (err) {
        console.error("Error updating certification:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}