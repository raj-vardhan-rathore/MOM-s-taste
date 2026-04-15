require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Shop = require("../models/Shop");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Shop.deleteMany({}),
    Order.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const admin = await User.create({
    fullName: "System Admin",
    email: "admin@momstaste.com",
    phone: "9999999999",
    password: "Admin@123",
    role: "admin",
  });

  const parent = await User.create({
    fullName: "Anita Sharma",
    email: "parent@momstaste.com",
    phone: "9000000001",
    password: "Parent@123",
    role: "parent",
    children: [
      {
        name: "Rohan Sharma",
        rollNumber: "CS24-102",
        hostelId: "H1",
        roomNumber: "204",
        city: "Pune",
        hostelAddress: "Hostel H1, ABC Institute, Pune",
      },
    ],
  });

  const shopOwner = await User.create({
    fullName: "Mithilesh Sweets Owner",
    email: "shop@momstaste.com",
    phone: "9000000002",
    password: "Shop@123",
    role: "shop_owner",
  });

  const shop = await Shop.create({
    owner: shopOwner._id,
    shopName: "Mithilesh Sweets",
    city: "Pune",
    address: "FC Road, Pune",
    contactNumber: "9000000002",
    description: "Homestyle sweets and snacks for students",
    approvalStatus: "approved",
    deliveryMethods: ["self", "third_party"],
    menu: [
      {
        name: "Gulab Jamun Box",
        description: "6 pieces",
        category: "Sweet",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
        price: 180,
      },
      {
        name: "Kaju Katli",
        description: "250 gm",
        category: "Sweet",
        image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db",
        price: 320,
      },
      {
        name: "Samosa Combo",
        description: "4 samosas + chutney",
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        price: 140,
      },
    ],
  });

  console.log("Seed complete");
  console.log({
    admin: admin.email,
    parent: parent.email,
    shopOwner: shopOwner.email,
    shopId: shop._id.toString(),
  });

  await mongoose.connection.close();
};

seed();
