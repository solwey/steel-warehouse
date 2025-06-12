import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';
import prisma from '@/lib/db/prisma';
import { isMatchingMaterial } from '@/lib/constants/materialMappings';

// Function to get random number between min and max
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const attachmentsDir = path.join(process.cwd(), 'public/eml-attachments', id);
    const responseDir = path.join(process.cwd(), 'public/eml-attachments', `response-${id}`);

    // Get all necessary materials
    const necessaryMaterials = await prisma.necessaryMaterial.findMany({
      select: {
        material: {
          select: {
            name: true,
            grade: true
          }
        }
      }
    });

    // Delete existing response files
    try {
      await fs.rm(responseDir, { recursive: true, force: true });
      await fs.mkdir(responseDir, { recursive: true });
    } catch (error) {
      console.error('Error cleaning response directory:', error);
    }

    // Read all files from attachments directory
    const files = await fs.readdir(attachmentsDir);
    const excelFiles = files.filter((file) => /\.(xls|xlsx)$/i.test(file));

    for (const filename of excelFiles) {
      try {
        const filePath = path.join(attachmentsDir, filename);
        const fileBuffer = await fs.readFile(filePath);
        const extension = filename.split('.').pop()?.toLowerCase();

        // Read the Excel file
        const workbook = XLSX.read(fileBuffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (data.length > 0) {
          // Keep header row
          const headerRow = data[0];

          // Find columns that might contain material information
          const possibleNameColumns = headerRow
            .map((header: string, index: number) => ({
              index,
              header: String(header || '').toLowerCase()
            }))
            .filter(
              (col) =>
                col.header.includes('name') ||
                col.header.includes('material') ||
                col.header.includes('type') ||
                col.header.includes('description')
            );

          const possibleGradeColumns = headerRow
            .map((header: string, index: number) => ({
              index,
              header: String(header || '').toLowerCase()
            }))
            .filter(
              (col) =>
                col.header.includes('grade') ||
                col.header.includes('spec') ||
                col.header.includes('standard') ||
                col.header.includes('class')
            );

          // Find all matching rows
          const allMatchingRows = data.slice(1).filter((row) => {
            // Check each possible name and grade column
            const nameMatches = possibleNameColumns.some((col) => {
              const value = String(row[col.index] || '').toLowerCase();
              return necessaryMaterials.some(
                (nm) => isMatchingMaterial(value, '') || isMatchingMaterial('', value)
              );
            });

            const gradeMatches = possibleGradeColumns.some((col) => {
              const value = String(row[col.index] || '').toLowerCase();
              return necessaryMaterials.some(
                (nm) => isMatchingMaterial('', value) || isMatchingMaterial(value, '')
              );
            });

            return nameMatches || gradeMatches;
          });

          // Only create response file if we found matching rows
          if (allMatchingRows.length > 0) {
            // Select random number of rows (5-8)
            const numRowsToSelect = getRandomInt(5, Math.min(8, allMatchingRows.length));
            const shuffledRows = shuffleArray(allMatchingRows);
            const selectedRows = shuffledRows.slice(0, numRowsToSelect);

            // Combine header with selected rows
            const filteredData = [headerRow, ...selectedRows];

            // Create new workbook with filtered data
            const newWorkbook = XLSX.utils.book_new();
            const newWorksheet = XLSX.utils.aoa_to_sheet(filteredData);
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, firstSheetName);

            // Write to response directory
            const responseFilePath = path.join(responseDir, filename);
            // Map extension to valid BookType
            const bookType = extension === 'xlsx' ? 'xlsx' : extension === 'xls' ? 'biff8' : 'xlsx';
            const newBuffer = XLSX.write(newWorkbook, {
              type: 'buffer',
              bookType: bookType as XLSX.BookType
            });
            await fs.writeFile(responseFilePath, newBuffer);
          }
        }
      } catch (error) {
        console.error(`Error processing Excel file ${filename}:`, error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error regenerating response files:', error);
    return NextResponse.json({ error: 'Failed to regenerate response files' }, { status: 500 });
  }
}
