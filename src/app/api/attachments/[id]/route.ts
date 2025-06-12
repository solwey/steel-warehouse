import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/db/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const filename = file.name;
    const responseDir = path.join(process.cwd(), 'public/eml-attachments', `response-${id}`);

    // Ensure directory exists
    await fs.mkdir(responseDir, { recursive: true });

    // Write file
    await fs.writeFile(path.join(responseDir, filename), new Uint8Array(arrayBuffer));

    return NextResponse.json({
      success: true,
      filename,
      url: `/eml-attachments/response-${id}/${filename}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new NextResponse('Failed to upload file', { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename');

    if (!filename) {
      return new NextResponse('No filename provided', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public/eml-attachments', `response-${id}`, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse('File not found', { status: 404 });
    }

    // Delete file
    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return new NextResponse('Failed to delete file', { status: 500 });
  }
}
