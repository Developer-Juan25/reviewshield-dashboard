/**
 * ReviewShield — Demo Data Seeder
 * Run: node seed-demo.mjs
 *
 * Prerequisites:
 *  1. Create demo account at reviewshield.vykmorix.com
 *     Email: demo@reviewshield.vykmorix.com
 *     Password: Demo123456!
 *  2. Complete onboarding (any business name, skip platforms)
 *  3. Run this script — it overwrites settings + seeds 18 reviews
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// ── Firebase Config ───────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyC8z8Kjj86HyJGr7Nid8MKdGykDiOipBBs",
  authDomain:        "reviewshield-84c6c.firebaseapp.com",
  projectId:         "reviewshield-84c6c",
  storageBucket:     "reviewshield-84c6c.firebasestorage.app",
  messagingSenderId: "947092276397",
  appId:             "1:947092276397:web:f09f523fbb84b3a8467224",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const auth = getAuth(app);

// ── Sign in as demo user ──────────────────────────────────
console.log("🔐 Signing in as demo user...");
const { user } = await signInWithEmailAndPassword(
  auth,
  "demo@reviewshield.vykmorix.com",
  "Demo123456!"
);
const userId = user.uid;
console.log(`✅ Signed in — userId: ${userId}`);

// ── Helper: days ago → Firestore Timestamp ────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return Timestamp.fromDate(d);
}

// ── SETTINGS ─────────────────────────────────────────────
const settings = {
  userId,
  businessName:    "La Terraza Bistró",
  alertEmail:      "demo@reviewshield.vykmorix.com",
  businessCity:    "Miami",
  businessAddress: "1420 Ocean Drive, Miami Beach, FL 33139",
  platforms: {
    google:      true,
    yelp:        true,
    facebook:    true,
    tripadvisor: true,
    trustpilot:  false,
  },
  plan:           "agency",
  trialStartedAt: null,
  trialEndsAt:    null,
  whiteLabel: {
    brandName:  "Vykmorix Agency",
    logoEmoji:  "🏢",
  },
  ownerId:    userId,
  ownerEmail: "demo@reviewshield.vykmorix.com",
  createdAt:  new Date().toISOString(),
  updatedAt:  new Date().toISOString(),
};

await setDoc(doc(db, "settings", userId), settings);
console.log("✅ Settings saved — La Terraza Bistró / Agency plan / White Label");

// ── REVIEWS ───────────────────────────────────────────────
const reviews = [
  // ── GOOGLE (8) ───────────────────────────────────────
  {
    platform:    "google",
    authorName:  "Sarah Mitchell",
    rating:      5,
    isNegative:  false,
    reviewText:  "Absolutely incredible experience! The paella was the best I've had outside of Spain, and the sangria was perfectly balanced. Our server Carlos was attentive and passionate about the food. Will definitely be back for our anniversary next year!",
    aiResponse:  "Thank you so much, Sarah! We're thrilled to hear the paella and sangria hit the mark — Carlos will be so happy to hear your kind words. We'd love to be part of your anniversary celebration next year. See you soon! 🥂",
    timestamp:   daysAgo(2),
    emailSent:   false,
  },
  {
    platform:    "google",
    authorName:  "James Rodriguez",
    rating:      5,
    isNegative:  false,
    reviewText:  "Wonderful dinner experience. The atmosphere is romantic and the food is consistently excellent. The octopus tapas were extraordinary. Definitely our new go-to spot for special occasions.",
    aiResponse:  "We're so glad to be your go-to spot, James! The octopus tapas are a team favorite too. We look forward to being part of your next special occasion — thank you for the wonderful review!",
    timestamp:   daysAgo(5),
    emailSent:   false,
  },
  {
    platform:    "google",
    authorName:  "Emily Chen",
    rating:      4,
    isNegative:  false,
    reviewText:  "Great food and wonderful ambiance. There was a short wait even with a reservation, but once seated the experience was fantastic. The seafood risotto was creamy and flavorful. Would come back!",
    aiResponse:  "Thank you for the kind words, Emily! We apologize for the wait — we're working on improving our reservation flow. So glad the risotto made up for it! We hope to see you again soon. 🙏",
    timestamp:   daysAgo(8),
    emailSent:   false,
  },
  {
    platform:    "google",
    authorName:  "Michael Torres",
    rating:      5,
    isNegative:  false,
    reviewText:  "Perfect date night spot. The candlelit terrace is gorgeous and the food lives up to the setting. The wine list is impressive and reasonably priced. My partner was blown away by the dessert selection.",
    aiResponse:  "How lovely, Michael! A great date night is exactly what we aim for. We're glad the terrace and desserts made the evening special. Please come back and celebrate many more moments with us! 🕯️",
    timestamp:   daysAgo(12),
    emailSent:   false,
  },
  {
    platform:    "google",
    authorName:  "Amanda Foster",
    rating:      5,
    isNegative:  false,
    reviewText:  "We hosted a corporate dinner here for 12 people and everything was flawless. The private dining area was elegant, the food was exceptional, and the staff was incredibly professional. Highly recommend for business entertaining.",
    aiResponse:  "Thank you Amanda! Hosting corporate events is something we take great pride in. We're thrilled the team delivered a flawless experience for your group. We'd love to host your next business dinner — feel free to contact us directly for reservations!",
    timestamp:   daysAgo(15),
    emailSent:   false,
  },
  {
    platform:    "google",
    authorName:  "David Kim",
    rating:      4,
    isNegative:  false,
    reviewText:  "Delicious tapas selection and great cocktails. The space gets a bit loud on weekend evenings but the food quality is consistently high. The patatas bravas are addictive.",
    aiResponse:  "Thank you David! The patatas bravas are a house staple for a reason! We appreciate the feedback on the noise level — we're exploring some acoustic improvements for weekend evenings. Hope to see you again!",
    timestamp:   daysAgo(20),
    emailSent:   false,
  },
  {
    platform:    "google",
    authorName:  "Rachel Nguyen",
    rating:      2,
    isNegative:  true,
    reviewText:  "Very disappointed with our visit. We had a reservation for 7pm and weren't seated until 7:45. The food arrived cold and when we mentioned it to the waiter he seemed indifferent. For these prices I expected much better service.",
    aiResponse:  "Rachel, we sincerely apologize for your experience. A 45-minute wait despite a reservation and cold food is completely unacceptable — this does not reflect our standards. We'd love the opportunity to make this right. Please contact us directly at latarrazamiami@email.com and we'll arrange a complimentary dinner for you and your party.",
    timestamp:   daysAgo(22),
    emailSent:   true,
  },
  {
    platform:    "google",
    authorName:  "Tom Bradley",
    rating:      1,
    isNegative:  true,
    reviewText:  "Terrible service from start to finish. The host was rude when we arrived, our order was wrong twice, and nobody seemed to care. Complete waste of money. Will not be returning and would not recommend.",
    aiResponse:  "Tom, we're truly sorry for this experience. Rude service and repeated order errors are serious issues we take very seriously. This is not who we are, and we want to understand exactly what happened. Please reach out to us directly — your feedback will go straight to management and we want to make this right.",
    timestamp:   daysAgo(30),
    emailSent:   true,
  },

  // ── YELP (4) ─────────────────────────────────────────
  {
    platform:    "yelp",
    authorName:  "Jessica L.",
    rating:      5,
    isNegative:  false,
    reviewText:  "Hidden gem! The sangria pitchers are enormous and so refreshing. We came for happy hour and ended up staying for dinner. The gambas al ajillo were perfectly garlicky. This place is a must-visit in Miami Beach.",
    aiResponse:  "Jessica, you made our day! Happy hour turning into a full dinner is exactly the vibe we love to create. The gambas al ajillo are a staff favorite too. Tell your friends and come back soon! 🦐",
    timestamp:   daysAgo(7),
    emailSent:   false,
  },
  {
    platform:    "yelp",
    authorName:  "Carlos M.",
    rating:      5,
    isNegative:  false,
    reviewText:  "Brought my whole family (15 people!) for my mom's 70th birthday and they handled everything beautifully. They even brought out a complimentary birthday flan. The staff went above and beyond. Absolutely memorable evening.",
    aiResponse:  "Happy 70th to your mom, Carlos! 🎉 Big family celebrations are our specialty and we're so glad it was memorable. The birthday flan is a small token of how much we appreciate you choosing us for such a special milestone. Muchas gracias!",
    timestamp:   daysAgo(18),
    emailSent:   false,
  },
  {
    platform:    "yelp",
    authorName:  "Patricia W.",
    rating:      4,
    isNegative:  false,
    reviewText:  "Upscale ambiance and solid Mediterranean food. Prices are on the higher end but it's Miami Beach so that's expected. The grilled branzino was excellent. Good for a special dinner, not an everyday spot.",
    aiResponse:  "Thank you Patricia! We do aim to be that special occasion destination and we're glad the branzino delivered. We appreciate your honest take on pricing — great food and ambiance are always our priority. Hope to see you for your next special dinner!",
    timestamp:   daysAgo(25),
    emailSent:   false,
  },
  {
    platform:    "yelp",
    authorName:  "Kevin R.",
    rating:      2,
    isNegative:  true,
    reviewText:  "Overpriced for the portion sizes. The tapas plates were tiny and we needed to order 8 dishes for two people to feel satisfied. Staff was friendly but the value just isn't there. Expected more for $180 dinner for two.",
    aiResponse:  "Kevin, thank you for the honest feedback on portion sizes and value. We hear you — our tapas are meant to be shared plates but we understand that can add up quickly. We're reviewing our menu structure to offer better value options. We hope you'll give us another chance to impress you.",
    timestamp:   daysAgo(35),
    emailSent:   true,
  },

  // ── FACEBOOK (3) ─────────────────────────────────────
  {
    platform:    "facebook",
    authorName:  "Sophie Durand",
    rating:      5,
    isNegative:  false,
    reviewText:  "Celebrated my anniversary here last Saturday — truly a magical evening. The terrace at sunset is breathtaking and the food was flawless. The sommelier recommended a perfect wine pairing. We will absolutely be back for every anniversary!",
    aiResponse:  "Sophie, congratulations on your anniversary! 💕 Watching the sunset from the terrace with great wine and food is everything we want for our guests. We'd be honored to be your annual anniversary tradition. See you next year!",
    timestamp:   daysAgo(3),
    emailSent:   false,
  },
  {
    platform:    "facebook",
    authorName:  "Marco Pellegrini",
    rating:      5,
    isNegative:  false,
    reviewText:  "Being Italian I'm very critical about Mediterranean food and La Terraza impressed me. The calamari fritti were perfectly crispy, the fresh pasta was al dente, and the service was warm and genuine. Bravissimi!",
    aiResponse:  "Grazie mille, Marco! A compliment from an Italian on our Mediterranean cuisine means the world to us 🙌 Our chef will be over the moon to hear this. Please come back soon — we'd love to keep impressing you!",
    timestamp:   daysAgo(10),
    emailSent:   false,
  },
  {
    platform:    "facebook",
    authorName:  "Linda Harrison",
    rating:      1,
    isNegative:  true,
    reviewText:  "Found a hair in my food and when I pointed it out, the manager shrugged and offered a small discount rather than replacing the dish. Absolutely disgusted. This is a hygiene issue and the response from management was completely dismissive.",
    aiResponse:  "Linda, we sincerely apologize — finding a foreign object in your food is unacceptable, full stop. The manager's response was also inappropriate and we are addressing this internally. Please contact us directly so we can fully refund your meal and ensure this never happens again. Your health and satisfaction are our absolute priority.",
    timestamp:   daysAgo(28),
    emailSent:   true,
  },

  // ── TRIPADVISOR (3) ──────────────────────────────────
  {
    platform:    "tripadvisor",
    authorName:  "William & Jane Cooper",
    rating:      5,
    isNegative:  false,
    reviewText:  "We visited during our Miami vacation and La Terraza was the highlight of our trip. Authentic Mediterranean cuisine, stunning ocean views, and some of the best service we've experienced anywhere in the world. Book in advance — it fills up fast!",
    aiResponse:  "William & Jane, what a wonderful review to receive! Making your Miami trip memorable is exactly what we aim for. We're so glad La Terraza was the highlight — please visit us again on your next trip to Miami. The ocean breeze will be waiting! 🌊",
    timestamp:   daysAgo(6),
    emailSent:   false,
  },
  {
    platform:    "tripadvisor",
    authorName:  "Isabelle Fontaine",
    rating:      4,
    isNegative:  false,
    reviewText:  "Lovely restaurant in a great location. Food is excellent — especially the seafood dishes. Service was attentive though it slowed down when the restaurant filled up around 8pm. Overall a very good dining experience and would recommend to visitors.",
    aiResponse:  "Merci, Isabelle! Great observation about service pace during peak hours — we're actively working on staffing to handle the 8pm rush better. So glad the seafood dishes impressed. We hope to see you on your next visit to Miami! 🐟",
    timestamp:   daysAgo(14),
    emailSent:   false,
  },
  {
    platform:    "tripadvisor",
    authorName:  "Robert Simmons",
    rating:      2,
    isNegative:  true,
    reviewText:  "Disappointing visit. The online menu shows many more options than what was actually available that night. We came specifically for the lobster paella which wasn't available and there were only 3 fish options despite being a seafood-focused restaurant.",
    aiResponse:  "Robert, we sincerely apologize for the discrepancy between our online menu and what was available that evening. Seasonal availability and supply challenges sometimes affect our offerings, but we should communicate this better — both online and when guests arrive. We're updating our website immediately. Thank you for bringing this to our attention.",
    timestamp:   daysAgo(40),
    emailSent:   true,
  },
];

// ── Write reviews to Firestore ────────────────────────────
console.log(`\n📝 Seeding ${reviews.length} reviews...`);
const reviewsCol = collection(db, "reviews");

for (const review of reviews) {
  await addDoc(reviewsCol, {
    ...review,
    userId,
    businessName: "La Terraza Bistró",
    alertEmail:   "demo@reviewshield.vykmorix.com",
  });
  const stars = "⭐".repeat(review.rating);
  const badge = review.isNegative ? " 🔴" : " 🟢";
  console.log(`  ${badge} [${review.platform.toUpperCase()}] ${stars} — ${review.authorName}`);
}

console.log(`\n✅ Demo seeded successfully!`);
console.log(`\n🔗 Open the app: https://reviewshield.vykmorix.com`);
console.log(`   Email:    demo@reviewshield.vykmorix.com`);
console.log(`   Password: Demo123456!\n`);

process.exit(0);
