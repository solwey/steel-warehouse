-- CreateEnum
CREATE TYPE "AccessRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('UNREADED', 'READED', 'PROCESSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "display_name" VARCHAR,
    "password_hash" TEXT,
    "access_role" "AccessRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "standard" TEXT,
    "category" TEXT,
    "unit" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "location" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "material_id" TEXT NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "necessary_materials" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "material_id" TEXT NOT NULL,

    CONSTRAINT "necessary_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incoming_emails" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EmailStatus" NOT NULL DEFAULT 'UNREADED',

    CONSTRAINT "incoming_emails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_email_key" ON "users"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "materials_code_key" ON "materials"("code");

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "necessary_materials" ADD CONSTRAINT "necessary_materials_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "users" ("id", "name", "email", "password_hash", "access_role")
VALUES
    ('user-uuid', 'User', 'user@user.com', '$2b$12$IrlS1JorPtF28W0r6DWeduGb5FoHZ5WS8WTQihRVkjX3Ej.NuweN2', 'USER'),
    ('admin-uuid', 'Admin', 'admin@admin.com', '$2b$12$IrlS1JorPtF28W0r6DWeduGb5FoHZ5WS8WTQihRVkjX3Ej.NuweN2', 'ADMIN');
