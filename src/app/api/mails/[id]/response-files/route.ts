import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const responseDir = path.join(process.cwd(), 'public/eml-attachments', `response-${id}`);

    try {
      const files = await fs.readdir(responseDir);
      const excelFiles = files
        .filter((file) => /\.(xls|xlsx)$/i.test(file))
        .map((file) => ({
          filename: file,
          url: `/eml-attachments/response-${id}/${file}`
        }));

      return NextResponse.json(excelFiles);
    } catch (error) {
      // If directory doesn't exist or is empty, return empty array
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error getting response files:', error);
    return NextResponse.json({ error: 'Failed to get response files' }, { status: 500 });
  }
}
