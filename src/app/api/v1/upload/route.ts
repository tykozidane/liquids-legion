import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import moment from "moment";
import { encrypt } from "@/lib/useAes256";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  // ✅ Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "The uploaded file is not a valid image." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const filename = file.name.replaceAll(" ", "_");
  const extension = path.extname(filename);
  const timestamp = moment().format('MMmmYYHHDDssSSS');
  const encryptedName = await encrypt(timestamp);
  const newFileName = `${encryptedName}${extension}`;

  try {
    await writeFile(
      path.join(process.cwd(), "public/images", newFileName),
      buffer
    );

    return NextResponse.json(
      {
        status: "00",
        message: "Upload successful",
        data: { filename: newFileName }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to save image." },
      { status: 500 }
    );
  }
};
