-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED', 'OVERDUE');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "supplier" TEXT NOT NULL,
    "expected_delivery" TIMESTAMP(3),
    "actual_delivery" TIMESTAMP(3),
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "payment_due_date" TIMESTAMP(3),
    "shipping_address" TEXT NOT NULL,
    "contact_person" TEXT,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert test data
INSERT INTO "orders" (
    "id", "material_id", "order_number", "unit_price", "quantity", "total_price",
    "status", "supplier", "expected_delivery", "actual_delivery",
    "payment_status", "payment_due_date", "shipping_address",
    "contact_person", "contact_phone", "contact_email", "notes",
    "created_at", "updated_at"
) VALUES
    ('ord1', 'mat1', 'ORD-2024-001', 35.00, 1200.0, 42000.00,
    'DELIVERED', 'Supplier X', '2024-02-15T00:00:00Z', '2024-02-14T00:00:00Z',
    'PAID', '2024-02-28T00:00:00Z', '123 Steel Street, Industrial Zone',
    'John Smith', '+1234567890', 'john@supplierx.com', 'First order of the year',
    '2024-01-15T00:00:00Z', '2024-02-14T00:00:00Z'),

    ('ord2', 'mat2', 'ORD-2024-002', 32.00, 1100.0, 35200.00,
    'IN_PRODUCTION', 'Supplier Y', '2024-03-20T00:00:00Z', NULL,
    'PARTIALLY_PAID', '2024-03-15T00:00:00Z', '456 Metal Road, Business Park',
    'Sarah Johnson', '+1987654321', 'sarah@suppliery.com', 'Urgent order',
    '2024-02-01T00:00:00Z', '2024-02-15T00:00:00Z'),

    ('ord3', 'mat3', 'ORD-2024-003', 38.00, 1000.0, 38000.00,
    'CONFIRMED', 'Supplier Z', '2024-04-01T00:00:00Z', NULL,
    'UNPAID', '2024-03-25T00:00:00Z', '789 Steel Avenue, Industrial Area',
    'Mike Brown', '+1122334455', 'mike@supplierz.com', 'Regular order',
    '2024-02-10T00:00:00Z', '2024-02-10T00:00:00Z'),

    ('ord4', 'mat4', 'ORD-2024-004', 40.00, 1300.0, 52000.00,
    'SHIPPED', 'Supplier X', '2024-03-10T00:00:00Z', NULL,
    'PAID', '2024-03-05T00:00:00Z', '321 Metal Street, Business District',
    'Emma Wilson', '+1555666777', 'emma@supplierx.com', 'Bulk order',
    '2024-02-20T00:00:00Z', '2024-03-01T00:00:00Z'),

    ('ord5', 'mat5', 'ORD-2024-005', 33.00, 1400.0, 46200.00,
    'PENDING', 'Supplier Y', '2024-04-15T00:00:00Z', NULL,
    'OVERDUE', '2024-04-10T00:00:00Z', '654 Steel Road, Industrial Park',
    'David Lee', '+1888999000', 'david@suppliery.com', 'Special order',
    '2024-03-01T00:00:00Z', '2024-03-01T00:00:00Z'),

    ('ord6', 'mat6', 'ORD-2024-006', 36.00, 1250.0, 45000.00,
    'CANCELLED', 'Supplier Z', '2024-03-05T00:00:00Z', NULL,
    'REFUNDED', '2024-03-01T00:00:00Z', '987 Metal Avenue, Business Zone',
    'Lisa Chen', '+1777888999', 'lisa@supplierz.com', 'Cancelled due to specification change',
    '2024-02-15T00:00:00Z', '2024-02-25T00:00:00Z'),

    ('ord7', 'mat7', 'ORD-2024-007', 34.00, 1100.0, 37400.00,
    'DELIVERED', 'Supplier X', '2024-02-28T00:00:00Z', '2024-02-27T00:00:00Z',
    'PAID', '2024-02-25T00:00:00Z', '147 Steel Lane, Industrial Complex',
    'Tom Anderson', '+1666777888', 'tom@supplierx.com', 'Regular order',
    '2024-02-05T00:00:00Z', '2024-02-27T00:00:00Z'),

    ('ord8', 'mat8', 'ORD-2024-008', 39.00, 1200.0, 46800.00,
    'IN_PRODUCTION', 'Supplier Y', '2024-03-25T00:00:00Z', NULL,
    'PARTIALLY_PAID', '2024-03-20T00:00:00Z', '258 Metal Road, Business Center',
    'Rachel Green', '+1444555666', 'rachel@suppliery.com', 'Urgent order',
    '2024-02-25T00:00:00Z', '2024-03-01T00:00:00Z'),

    ('ord9', 'mat1', 'ORD-2024-009', 37.00, 1300.0, 48100.00,
    'PENDING', 'Supplier X', '2024-05-01T00:00:00Z', NULL,
    'UNPAID', '2024-04-25T00:00:00Z', '123 Steel Street, Industrial Zone',
    'John Smith', '+1234567890', 'john@supplierx.com', 'Repeat order for mat1',
    '2024-04-01T00:00:00Z', '2024-04-01T00:00:00Z'),

    ('ord10', 'mat2', 'ORD-2024-010', 31.00, 1000.0, 31000.00,
    'CONFIRMED', 'Supplier Y', '2024-05-10T00:00:00Z', NULL,
    'PARTIALLY_PAID', '2024-05-05T00:00:00Z', '456 Metal Road, Business Park',
    'Sarah Johnson', '+1987654321', 'sarah@suppliery.com', 'Repeat order for mat2',
    '2024-04-05T00:00:00Z', '2024-04-05T00:00:00Z'),

    ('ord11', 'mat3', 'ORD-2024-011', 40.00, 1100.0, 44000.00,
    'SHIPPED', 'Supplier Z', '2024-05-15T00:00:00Z', NULL,
    'PAID', '2024-05-10T00:00:00Z', '789 Steel Avenue, Industrial Area',
    'Mike Brown', '+1122334455', 'mike@supplierz.com', 'Repeat order for mat3',
    '2024-04-10T00:00:00Z', '2024-04-10T00:00:00Z'),

    ('ord12', 'mat1', 'ORD-2024-012', 33.00, 1200.0, 39600.00,
    'DELIVERED', 'Supplier X', '2024-05-20T00:00:00Z', '2024-05-19T00:00:00Z',
    'PAID', '2024-05-15T00:00:00Z', '321 Metal Street, Business District',
    'Emma Wilson', '+1555666777', 'emma@supplierx.com', 'Repeat order for mat4',
    '2024-04-15T00:00:00Z', '2024-05-19T00:00:00Z'),

    ('ord13', 'mat1', 'ORD-2024-013', 36.00, 1400.0, 50400.00,
    'IN_PRODUCTION', 'Supplier Y', '2024-05-25T00:00:00Z', NULL,
    'OVERDUE', '2024-05-20T00:00:00Z', '654 Steel Road, Industrial Park',
    'David Lee', '+1888999000', 'david@suppliery.com', 'Repeat order for mat5',
    '2024-04-20T00:00:00Z', '2024-04-20T00:00:00Z'),

    ('ord14', 'mat3', 'ORD-2024-014', 34.00, 1000.0, 34000.00,
    'CANCELLED', 'Supplier Z', '2024-05-30T00:00:00Z', NULL,
    'REFUNDED', '2024-05-25T00:00:00Z', '987 Metal Avenue, Business Zone',
    'Lisa Chen', '+1777888999', 'lisa@supplierz.com', 'Repeat order for mat6',
    '2024-04-25T00:00:00Z', '2024-04-25T00:00:00Z'),

    ('ord15', 'mat4', 'ORD-2024-015', 38.00, 1200.0, 45600.00,
    'CONFIRMED', 'Supplier X', '2024-06-01T00:00:00Z', NULL,
    'UNPAID', '2024-05-30T00:00:00Z', '147 Steel Lane, Industrial Complex',
    'Tom Anderson', '+1666777888', 'tom@supplierx.com', 'Repeat order for mat7',
    '2024-05-01T00:00:00Z', '2024-05-01T00:00:00Z'),

    ('ord16', 'mat2', 'ORD-2024-016', 35.00, 1100.0, 38500.00,
    'PENDING', 'Supplier Y', '2024-06-05T00:00:00Z', NULL,
    'PARTIALLY_PAID', '2024-06-01T00:00:00Z', '258 Metal Road, Business Center',
    'Rachel Green', '+1444555666', 'rachel@suppliery.com', 'Repeat order for mat8',
    '2024-05-05T00:00:00Z', '2024-05-05T00:00:00Z'),

    ('ord17', 'mat5', 'ORD-2024-017', 37.50, 1500.0, 56250.00,
    'IN_PRODUCTION', 'Supplier X', '2024-06-10T00:00:00Z', NULL,
    'UNPAID', '2024-06-05T00:00:00Z', '123 Steel Street, Industrial Zone',
    'John Smith', '+1234567890', 'john@supplierx.com', 'Large batch for summer',
    '2024-05-10T00:00:00Z', '2024-05-10T00:00:00Z'),

    ('ord18', 'mat6', 'ORD-2024-018', 32.80, 900.0, 29520.00,
    'CONFIRMED', 'Supplier Y', '2024-06-15T00:00:00Z', NULL,
    'PARTIALLY_PAID', '2024-06-10T00:00:00Z', '456 Metal Road, Business Park',
    'Sarah Johnson', '+1987654321', 'sarah@suppliery.com', 'Small urgent order',
    '2024-05-15T00:00:00Z', '2024-05-15T00:00:00Z'),

    ('ord19', 'mat7', 'ORD-2024-019', 41.00, 1000.0, 41000.00,
    'SHIPPED', 'Supplier Z', '2024-06-20T00:00:00Z', NULL,
    'PAID', '2024-06-15T00:00:00Z', '789 Steel Avenue, Industrial Area',
    'Mike Brown', '+1122334455', 'mike@supplierz.com', 'Express shipment',
    '2024-05-20T00:00:00Z', '2024-06-01T00:00:00Z'),

    ('ord20', 'mat8', 'ORD-2024-020', 36.50, 1300.0, 47450.00,
    'DELIVERED', 'Supplier X', '2024-06-25T00:00:00Z', '2024-06-24T00:00:00Z',
    'PAID', '2024-06-20T00:00:00Z', '321 Metal Street, Business District',
    'Emma Wilson', '+1555666777', 'emma@supplierx.com', 'End of quarter order',
    '2024-05-25T00:00:00Z', '2024-06-24T00:00:00Z'),

    ('ord21', 'mat1', 'ORD-2024-021', 34.20, 1150.0, 39330.00,
    'PENDING', 'Supplier Y', '2024-07-01T00:00:00Z', NULL,
    'UNPAID', '2024-06-28T00:00:00Z', '654 Steel Road, Industrial Park',
    'David Lee', '+1888999000', 'david@suppliery.com', 'New product launch',
    '2024-06-01T00:00:00Z', '2024-06-01T00:00:00Z');