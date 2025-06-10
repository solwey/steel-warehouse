/*
  Warnings:

  - You are about to drop the `inventory_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `necessary_materials` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('available', 'reserved', 'used', 'scrap');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('low', 'medium', 'high');

-- DropForeignKey
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_material_id_fkey";

-- DropForeignKey
ALTER TABLE "necessary_materials" DROP CONSTRAINT "necessary_materials_material_id_fkey";

-- DropTable
DROP TABLE "inventory_items";

-- DropTable
DROP TABLE "materials";

-- DropTable
DROP TABLE "necessary_materials";

-- CreateTable
CREATE TABLE "material" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "description" TEXT,
    "chemical_composition" JSONB,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "coil_number" TEXT,
    "thickness" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "date_received" TIMESTAMP(3) NOT NULL,
    "status" "InventoryStatus" NOT NULL,
    "comment" TEXT,

    CONSTRAINT "inventory_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "necessary_material" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "required_thickness" DOUBLE PRECISION NOT NULL,
    "required_width" DOUBLE PRECISION NOT NULL,
    "required_weight" DOUBLE PRECISION NOT NULL,
    "urgency" "UrgencyLevel" NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,

    CONSTRAINT "necessary_material_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "necessary_material" ADD CONSTRAINT "necessary_material_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- material
INSERT INTO material (id, name, grade, description, chemical_composition) VALUES
('mat1', 'Commercial Steel', 'CS Type B', 'Commercial grade steel Type B, common structural steel', '{"C":0.15, "Mn":0.5, "Si":0.02, "P":0.025, "S":0.02, "Al":0.03, "Cr":0.01, "Ni":0.01}'),
('mat2', 'Interstitial Free', 'IF', 'Interstitial Free steel, used in automotive panels', '{"C":0.01, "Mn":0.2, "Si":0.01, "P":0.02, "S":0.01, "Al":0.04, "Ti":0.03, "Nb":0.01}'),
('mat3', 'High Strength Low Alloy', 'HSLA', 'High strength low alloy steel, structural and automotive use', '{"C":0.1, "Mn":1.2, "Nb":0.03, "Si":0.15, "P":0.02, "S":0.01, "V":0.02, "Ti":0.01}'),
('mat4', 'Cold Rolled', 'DD11', 'Cold rolled steel, mild quality', '{"C":0.12, "Mn":0.4, "Si":0.02, "P":0.025, "S":0.02, "Al":0.03, "Cr":0.01, "Cu":0.01}'),
('mat5', 'Hot Rolled', 'HR', 'Hot rolled steel, general purpose', '{"C":0.16, "Mn":0.6, "Si":0.03, "P":0.03, "S":0.02, "Al":0.02, "Cr":0.01, "Mo":0.01}'),
('mat6', 'Commercial Steel', 'CS Type B with Boron', 'Commercial steel with Boron alloying for strength', '{"C":0.15, "B":0.002, "Mn":0.5, "Si":0.02, "P":0.025, "S":0.02, "Al":0.03, "Ti":0.01}'),
('mat7', 'Electro-Galvanized', 'EG', 'Electro-galvanized steel sheet for corrosion resistance', '{"C":0.08, "Mn":0.3, "Si":0.01, "P":0.02, "S":0.01, "Al":0.02, "Zn":0.1, "Cr":0.01}'),
('mat8', 'Hot Dipped Galvanized', 'GI', 'Hot dipped galvanized steel sheet', '{"C":0.09, "Mn":0.35, "Si":0.01, "P":0.02, "S":0.01, "Al":0.02, "Zn":0.2, "Cr":0.01}');

-- inventory_item
INSERT INTO inventory_item (id, material_id, coil_number, thickness, width, weight, location, supplier, date_received, status, comment) VALUES
('inv1', 'mat1', 'C-1001', 1.2, 1250, 1200, 'Warehouse A', 'Supplier X', '2025-06-01T10:00:00Z', 'available', 'First batch'),
('inv2', 'mat2', 'C-2002', 0.8, 1000, 900, 'Warehouse B', 'Supplier Y', '2025-05-25T14:00:00Z', 'available', NULL),
('inv3', 'mat3', 'C-3003', 1.5, 1500, 1600, 'Warehouse A', 'Supplier Z', '2025-05-30T09:00:00Z', 'reserved', 'Reserved for project A'),
('inv4', 'mat4', 'C-4004', 0.7, 1200, 850, 'Warehouse C', 'Supplier X', '2025-05-20T11:00:00Z', 'used', 'Used in production'),
('inv5', 'mat5', 'C-5005', 2.0, 1400, 2000, 'Warehouse A', 'Supplier Y', '2025-06-05T08:00:00Z', 'available', 'Large coil'),
('inv6', 'mat6', 'C-6006', 1.0, 1100, 950, 'Warehouse B', 'Supplier X', '2025-06-02T12:00:00Z', 'available', 'Borated steel'),
('inv7', 'mat7', 'C-7007', 0.9, 1250, 1000, 'Warehouse C', 'Supplier Z', '2025-05-28T13:00:00Z', 'scrap', 'Damaged coil'),
('inv8', 'mat8', 'C-8008', 1.1, 1300, 1100, 'Warehouse A', 'Supplier Y', '2025-06-03T15:00:00Z', 'available', NULL);

-- necessary_material
INSERT INTO necessary_material (id, material_id, required_thickness, required_width, required_weight, urgency, due_date, comment) VALUES
('need1', 'mat1', 1.2, 1250, 500, 'high', '2025-06-20T00:00:00Z', 'Urgent for new order'),
('need2', 'mat2', 0.8, 1000, 300, 'medium', '2025-07-01T00:00:00Z', NULL),
('need3', 'mat3', 1.5, 1500, 700, 'low', '2025-07-15T00:00:00Z', 'Possible future demand'),
('need4', 'mat4', 0.7, 1200, 400, 'medium', '2025-06-25T00:00:00Z', 'Restock cold rolled'),
('need5', 'mat5', 2.0, 1400, 800, 'high', '2025-06-22T00:00:00Z', 'Needed for structural frame'),
('need6', 'mat6', 1.0, 1100, 350, 'high', '2025-06-18T00:00:00Z', 'Boron steel required'),
('need7', 'mat7', 0.9, 1250, 450, 'low', '2025-07-05T00:00:00Z', 'Scrap coil replacement'),
('need8', 'mat8', 1.1, 1300, 500, 'medium', '2025-06-30T00:00:00Z', NULL);
