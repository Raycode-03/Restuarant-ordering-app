import { ShoppingCart, Zap, CreditCard, Clock, Users, Gauge, Shield } from 'lucide-react';

const thisYear = new Date().getFullYear();

export const homePage = {
  title: "Scan. Order. Relax.",
  description: "The future of dining is contactless and effortless. Experience the premium standard of service with zero wait times.",
  btn: "Get Started",
  getMore: "Learn More",
  images: [
    "https://res.cloudinary.com/dkolikr3y/image/upload/v1771913576/12_Fancy_Gift_Basket_Ideas_for_Housewarming_That_Make_New_Homes_Feel_Like_Luxury_Hotels_o4aj0g.jpg",
    "https://res.cloudinary.com/dkolikr3y/image/upload/v1771913577/Pan_Seared_Filet_Mignon_with_Red_Wine_Sauce_suwrmn.jpg",
    "https://res.cloudinary.com/dkolikr3y/image/upload/v1771913576/download_nzxge0.jpg",
    "https://res.cloudinary.com/dkolikr3y/image/upload/v1771913575/food__foodie__food_lover__delicious__street_food__kitty__kitten_oivb6e.jpg"
  ]
};

export const tables = {
  title: "Smart Tables",
  tableName: "Scan to order instantly",
};

export const about = {  
  title: "Seamless Dining",
  steps: [
    {
      icon: Users,
      title: "Sit Down",
      description: "Choose any available table. No need to wait for a host.",
    },
    {
      icon: ShoppingCart,
      title: "Scan Code",
      description: "Scan the table's QR code to instantly view the digital menu.",
    },
    {
      icon: Zap,
      title: "Enjoy Your Meal",
      description: "Order directly from your phone. Food arrives, you relax.",
    },
  ],
};

export const whyUs = {
  title: "Why Savory & Co",
  description: "Premium features for modern establishments.",
  steps: [
    {
      icon: Zap,
      title: "Instant Ordering",
      description: "No wait times. Browse the menu and place your order in seconds.",
    },
    {
      icon: CreditCard,
      title: "Lightning Fast Payments",
      description: "Accept Apple Pay, Google Pay, and cards instantly without waiting for the bill.",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Know exactly when your food is being prepared and when it will arrive.",
    },
    {
      icon: Users,
      title: "Staff Efficiency",
      description: "Servers focus on hospitality rather than order taking and payment processing.",
    },
    {
      icon: Gauge,
      title: "Faster Service",
      description: "Turn tables faster with streamlined ordering and zero bottlenecks.",
    },
    {
      icon: Shield,
      title: "Contactless",
      description: "Safe, hygienic, and modern — no menus to pass around, no cash to handle.",
    },
  ],
};

export const testimonies = {
  title: "Dining Made Effortless",
  description: "Join 1,000+ customers enjoying our services today.",
  items: [
    {
      image: "/images/person1.jpg",
      name: "Amara O.",
      role: "Regular Customer",
      text: "I love how easy it is to order without flagging down a waiter. The food came out fast and the whole experience felt premium.",
    },
    {
      image: "/images/person2.jpg",
      name: "Chidi N.",
      role: "Food Blogger",
      text: "Savory & Co has completely changed how I think about dining out. The QR ordering is seamless and the payment process is instant.",
    },
    {
      image: "/images/person3.jpg",
      name: "Fatima B.",
      role: "First-time Visitor",
      text: "I was skeptical at first but scanning the QR code and ordering from my phone was surprisingly smooth. Will definitely be back.",
    },
    {
      image: "/images/person4.jpg",
      name: "Emeka J.",
      role: "Business Lunch Regular",
      text: "Perfect for quick business lunches. No waiting, no fuss. The real-time tracking is a great touch — you always know when your food is coming.",
    },
  ],
};
export const faq = {
  title: "Frequently Asked Questions",
  description: "Everything you need to know about dining with us.",
  items: [
    {
      question: "How do I place an order?",
      answer: "Simply scan the QR code on your table with your phone camera, browse the digital menu, and tap to order. No app download required.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major cards, Apple Pay, and Google Pay. Payment is processed securely at checkout — no cash needed.",
    },
    {
      question: "How do I know when my food is ready?",
      answer: "Once your order is placed, you can track it in real time directly from your phone. You'll see when it's being prepared and when it's on its way to your table.",
    },
    {
      question: "Can I modify or cancel my order after placing it?",
      answer: "Orders can be modified within 2 minutes of being placed. After that, the kitchen has already begun preparation. Please speak to a staff member if you need urgent changes.",
    },
    {
      question: "Do I need to create an account?",
      answer: "No account needed. Just scan your table's QR code and you're ready to order instantly.",
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes. All payments are processed through Stripe, which is PCI-compliant and uses industry-standard encryption to keep your data safe.",
    },
    {
      question: "What if I have a food allergy?",
      answer: "Each menu item displays its ingredients and allergen information. If you have a severe allergy, please inform a staff member before ordering.",
    },
    {
      question: "Can I split the bill with friends?",
      answer: "Currently each table processes one payment at checkout. You can split the cost outside the app using your preferred method.",
    },
  ],
};
export const footer = {
  icon: "/logos/savory_icon.png",
  links: {
    About: "#about",
    Testimonies: "#testimonies",
    WhyUs: "#why",
    Contact: "#contact",
  },
  contact: [
    {
      platform: "WhatsApp",
      link: "https://wa.me/2349167019229",
    },
    {
      platform: "Instagram",
      link: "https://instagram.com/akerele.raymond",
    },
  ],
  copy: `© ${thisYear} Savory & Co. All rights reserved.`,
};