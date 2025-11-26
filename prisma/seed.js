const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

async function main() {
  console.log("🌱 Memulai seeding database...");

  // Clear existing data
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Generate 10 Users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        nama: `User ${i}`,
        password: hashedPassword,
      },
    });
    users.push(user);
    console.log(`✅ User ${i} created: ${user.email}`);
  }

  // Generate 50 Products
  const productTitles = [
    "Laptop Gaming",
    "Mouse Wireless",
    "Keyboard Mechanical",
    "Monitor 4K",
    "Headphone Noise Cancelling",
    "Webcam HD",
    "Microphone USB",
    "Speaker Bluetooth",
    "USB Hub",
    "Cooling Pad",
    "External SSD 1TB",
    "Graphics Tablet",
    "Drawing Pen",
    "HDMI Cable",
    "USB Type-C Cable",
    "Charger Fast",
    "Power Bank 20000mAh",
    "Desk Lamp LED",
    "Mouse Pad RGB",
    "CPU Cooler",
    "RAM DDR4 16GB",
    "Motherboard B550",
    "Power Supply 750W",
    "Case Gaming",
    "Fan Case 120mm",
    "Thermal Paste",
    "Cable Organizer",
    "Screen Protector",
    "Keyboard Pad",
    "Monitor Arm",
    "Standing Desk",
    "Chair Gaming",
    "Desk Organizer",
    "Cable Sleeve",
    "Phone Stand",
    "Tablet Stand",
    "Laptop Stand",
    "Desk Mat",
    "Wireless Charger",
    "USB Adapter",
    "Network Switch",
    "Ethernet Cable",
    "WiFi Extender",
    "Router WiFi 6",
    "Modem 5G",
    "Smart Hub",
    "LED Strip",
    "Smart Bulb",
    "Webcam Security",
    "Portable Projector",
  ];

  const prices = [
    500000, 150000, 300000, 2000000, 1200000, 400000, 250000, 500000, 200000,
    150000, 800000, 600000, 100000, 50000, 75000, 200000, 300000, 100000,
    180000, 250000, 400000, 1200000, 1000000, 800000, 150000, 50000, 100000,
    80000, 200000, 400000, 5000000, 2500000, 3000000, 50000, 100000, 150000,
    300000, 200000, 400000, 100000, 800000, 150000, 800000, 2000000, 1500000,
    500000, 100000, 80000, 300000, 1200000,
  ];

  let productCount = 0;
  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const product = await prisma.product.create({
      data: {
        title: productTitles[i % productTitles.length],
        price: prices[i % prices.length],
        image: `https://via.placeholder.com/300?text=${i + 1}`,
        userId: randomUser.id,
      },
    });
    productCount++;
    console.log(
      `✅ Product ${i + 1} created: ${product.title} - Rp${product.price}`
    );
  }

  console.log("\n🎉 Seeding selesai!");
  console.log(`📊 Total Users: 10`);
  console.log(`📊 Total Products: ${productCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
