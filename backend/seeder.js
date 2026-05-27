import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';
import connectDB from './config/db.js';

console.log(`\x1b[36m%s\x1b[0m`, `🔗 Connecting to: ${process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'NOT SET - check .env file'}`);

// Standard premium Unsplash images for tech items
const productsData = [
  {
    title: "Quantum 15\" Pro Ultrabook",
    image: "https://images.unsplash.com/photo-1496181130207-93310b24d761?w=600&auto=format&fit=crop&q=60",
    description: "Experience ultimate performance with the Quantum Pro Ultrabook. Featuring a 15.6\" OLED borderless display, a next-gen 12-core processor, 32GB LPDDR5 RAM, and a ultra-thin aerospace grade aluminum chassis. Built for creators and professionals who demand power on the move.",
    category: "Laptops",
    price: 1499.99,
    stock: 12,
    ratings: 4.8,
    numReviews: 2,
    reviews: [
      {
        name: "Alice Johnson",
        rating: 5,
        comment: "This is hands-down the best laptop I have ever owned. The OLED screen is incredibly bright and battery life easily gets me through a full day of coding.",
        user: null // Will be assigned during seed
      },
      {
        name: "Mark Smith",
        rating: 4,
        comment: "Excellent build quality and typing experience. It runs a bit warm under intensive rendering tasks, but otherwise absolutely silent.",
        user: null
      }
    ]
  },
  {
    title: "AeroSound ANC-700 Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
    description: "Immerse yourself in pure auditory bliss with AeroSound ANC-700. Features industry-leading Active Noise Cancellation (up to 40dB reduction), 45-hour battery life with hyper-charge, customizable sound stages via EQ profiles, and plush memory-foam ear cushions.",
    category: "Audio",
    price: 299.99,
    stock: 25,
    ratings: 4.6,
    numReviews: 1,
    reviews: [
      {
        name: "David Miller",
        rating: 5,
        comment: "The noise cancellation is magical! Blocks out office chatter and flights completely. Super comfortable to wear for hours.",
        user: null
      }
    ]
  },
  {
    title: "Apex Mechanical Gaming Keyboard",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60",
    description: "Dominate the competition with the Apex 75% Custom Mechanical Keyboard. Features hot-swappable tactile linear switches, double-shot PBT keycaps, sound-dampening foam overlays, and customizable per-key dynamic RGB backlighting.",
    category: "Accessories",
    price: 149.50,
    stock: 15,
    ratings: 4.9,
    numReviews: 1,
    reviews: [
      {
        name: "Emily Davis",
        rating: 5,
        comment: "The sound profile of this keyboard out of the box is incredible. Very creamy thock sounds, smooth typing, excellent keycap texture.",
        user: null
      }
    ]
  },
  {
    title: "Helix Smartwatch Series 5",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
    description: "Track your health, performance, and life style seamlessly with Helix Series 5. Outfitted with an always-on Retina display, precise GPS tracking, continuous heart-rate monitoring, sleep stage diagnostics, and up to 7 days of active battery.",
    category: "Wearables",
    price: 229.00,
    stock: 18,
    ratings: 4.4,
    numReviews: 1,
    reviews: [
      {
        name: "Chris Evans",
        rating: 4,
        comment: "Very elegant style. Fits nicely on the wrist and step counting is remarkably accurate. I wish it had more watch face options, but the current collection is good.",
        user: null
      }
    ]
  },
  {
    title: "Horizon 34\" Curved UltraWide Monitor",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=60",
    description: "Transform your workspace with Horizon 34\". Features a dramatic 1500R curved ultra-wide QHD panel, 144Hz refresh rate, 99% sRGB color gamut for designers, and a single USB-C port that delivers video and 90W power delivery to your notebook.",
    category: "Monitors",
    price: 549.99,
    stock: 8,
    ratings: 4.7,
    numReviews: 1,
    reviews: [
      {
        name: "Sophia Martinez",
        rating: 5,
        comment: "Perfect monitor for productivity! The curves are gentle and reduce eye strain. Single-cable USB-C connection keeps my desk extremely tidy.",
        user: null
      }
    ]
  },
  {
    title: "Vortex Gaming Mouse G90",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60",
    description: "Ultralight gaming mouse weighing just 58 grams. Packed with a 26K DPI optical sensor, optical mouse switches for zero debounce latency, and a hyper-flexible paracord cable. Built for swift speed and absolute pinpoint accuracy.",
    category: "Accessories",
    price: 79.99,
    stock: 30,
    ratings: 4.5,
    numReviews: 1,
    reviews: [
      {
        name: "Ryan Reynolds",
        rating: 4,
        comment: "Extremely light and slides smoothly across my desk. Battery lasts a long time. The side buttons are a bit small but very clicky.",
        user: null
      }
    ]
  },
  {
    title: "Nexus Pro Smartphone 12",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60",
    description: "The peak of smartphone design. Features a cinematic 6.7\" 120Hz display, a triple-lens system with 108MP primary camera, 8K video capture, 5G advanced networking, and secure under-display ultrasonic fingerprint readers.",
    category: "Smartphones",
    price: 999.00,
    stock: 10,
    ratings: 4.7,
    numReviews: 1,
    reviews: [
      {
        name: "Jessica Taylor",
        rating: 5,
        comment: "The camera is absolutely mind-blowing. Night mode photos look like they were shot on a professional DSLR. Charging is incredibly fast too.",
        user: null
      }
    ]
  },
  {
    title: "Quantum Powerbank 20K",
    image: "https://images.unsplash.com/photo-1609592424085-f5da1752b04f?w=600&auto=format&fit=crop&q=60",
    description: "Never run out of power with this massive 20,000mAh backup bank. Features dual USB-C Power Delivery ports capable of supplying up to 65W, allowing you to charge both your laptop and phone simultaneously at full speed.",
    category: "Accessories",
    price: 49.99,
    stock: 40,
    ratings: 4.3,
    numReviews: 0,
    reviews: []
  }
];

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas for seeding...');
    const connected = await connectDB();

    if (!connected) {
      console.error(`\x1b[31m%s\x1b[0m`, '✖ Cannot seed: MongoDB connection failed. Check your MONGO_URI in backend/.env');
      process.exit(1);
    }

    console.log('Cleaning up existing database data...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    console.log('Creating admin and standard user...');
    
    // Seed Users using .create to ensure pre-save hooks hash the passwords properly
    const adminUser = await User.create({
      name: 'Admin Master',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const standardUser = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });

    console.log('✔ Users Seeded Successfully');

    // Create a cart for each user
    await Cart.create({ user: adminUser._id, products: [] });
    await Cart.create({ user: standardUser._id, products: [] });

    console.log('Seeding products and reviews...');
    // Map reviews to the seeded standard user ID
    const formattedProducts = productsData.map((prod) => {
      const reviews = prod.reviews.map((rev) => ({
        ...rev,
        user: standardUser._id,
      }));
      return {
        ...prod,
        reviews,
      };
    });

    await Product.insertMany(formattedProducts);
    console.log(`\x1b[32m%s\x1b[0m`, '✔ Products and Reviews Seeded Successfully!');
    
    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `✖ Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
