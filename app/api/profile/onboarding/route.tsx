import dbConnect from "@/lib/db/dbConnect";
import userModel from "@/models/User";
import { uploadImagesToAzure } from "@/lib/azure/upload";
import { getUserId } from "@/lib/auth";

export async function POST(req: Request) {
    const userId = getUserId(req);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        await dbConnect();

        const formData = await req.formData();

        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const descriptionType = formData.get("descriptionType") as string;

        const file = formData.get("image") as File | null;

        const user = await userModel.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }


        let imageUrl;

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${Date.now()}-${file.name}`;

            imageUrl = await uploadImagesToAzure(buffer, fileName, file.type);
        }


        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                descriptionType,
                profilePictureUrl: imageUrl,
                onboardingCompleted: true
            },
            { new: true }
        );


        const data = {
            firstName: updatedUser?.firstName,
            lastName: updatedUser?.lastName,
            descriptionType: updatedUser?.descriptionType,
            profilePictureUrl: updatedUser?.profilePictureUrl,
            onboardingCompleted: updatedUser?.onboardingCompleted
        }
        return new Response(JSON.stringify({ data: "Onboarding completed successfully", user: data }), { status: 200 });
    } catch (err) {
        console.error("Onboarding error:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }

}