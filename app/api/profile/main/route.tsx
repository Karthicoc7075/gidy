import User from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";
import { getUserId } from "@/lib/auth";
import { uploadResumeToAzure } from "@/lib/azure/upload";



export async function GET(req: Request) {
    const userId = getUserId(req);


    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }



        return new Response(JSON.stringify(user), { status: 200 });
    }
    catch (err) {
        console.error("Error fetching profile:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}


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

        const formData = await req.formData();

        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const bio = formData.get("bio") as string;
        const location = formData.get("location") as string;
        const file = formData.get("file") as File | null;
        const profilePicture = formData.get("image") as File | null;


        let resumeUrl;
        let profilePictureUrl;

        if (profilePicture) {
            const buffer = Buffer.from(await profilePicture.arrayBuffer());
            const fileName = `${Date.now()}-${profilePicture.name}`;

            profilePictureUrl = await uploadResumeToAzure(buffer, fileName, profilePicture.type);
        }

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${Date.now()}-${file.name}`;
            resumeUrl = await uploadResumeToAzure(buffer, fileName, file.type);
        }




        const updateData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                bio,
                location,
                resumeUrl,
                profilePictureUrl
            },
            { new: true }
        );

        const data = {
            firstName: updateData?.firstName,
            lastName: updateData?.lastName,
            bio: updateData?.bio,
            location: updateData?.location,
            resumeUrl: updateData?.resumeUrl,
            profilePictureUrl: updateData?.profilePictureUrl
        }
        return new Response(JSON.stringify({ user: data }), { status: 200 });
    }
    catch (err) {
        console.error("Error updating profile:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

