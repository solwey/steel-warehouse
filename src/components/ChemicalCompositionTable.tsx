import { Prisma } from '@prisma/client';

interface ChemicalCompositionTableProps {
  composition: Prisma.JsonValue;
}

export function ChemicalCompositionTable({ composition }: ChemicalCompositionTableProps) {
  return (
    <div className="text-sm mt-2">
      <p className="font-semibold mb-1">Required chemical composition:</p>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {Object.keys(composition).map((key) => (
              <th key={key} className="border px-2 py-1 text-left font-medium bg-muted">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.values(composition).map((value, idx) => (
              <td key={idx} className="border px-2 py-1">
                {value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
