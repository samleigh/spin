// Mock data for Spin MVP
export const SPARK_PACKAGES = [
  { id: 's', sparks: 330, price: 3.99, label: 'Starter', icon: '⚡', note: '~22 skips', pop: false },
  { id: 'v', sparks: 1110, price: 9.99, label: 'Popular', icon: '⚡⚡', note: '~74 skips · Best value', pop: true },
  { id: 'p', sparks: 2500, price: 19.99, label: 'Power', icon: '⚡⚡⚡', note: '~166 skips', pop: false },
  { id: 'e', sparks: 6000, price: 39.99, label: 'Elite', icon: '🌟', note: '~400 skips + Boost', pop: false },
];

export const SKIP_COST = 15;

export const INTERESTS_ALL = [
  '☕ Coffee', '🎵 Music', '🎮 Gaming', '✈️ Travel', '🏋️ Fitness',
  '📚 Reading', '🍕 Food', '😂 Comedy', '🧠 Tech', '🎬 Film',
  '🐶 Pets', '🏔️ Outdoors', '🎨 Art', '📈 Finance', '🌱 Wellness', '🎸 Live music'
];

export const NAMES_F = ['Priya', 'Sarah', 'Jamie', 'Mia', 'Taylor', 'Sofia', 'Alex', 'Jordan', 'Ava', 'Dana'];
export const NAMES_M = ['Marcus', 'James', 'Tyler', 'Luca', 'Devon', 'Ryan', 'Chris', 'Noah', 'Eric', 'Cole'];
export const LOCATIONS = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Austin, TX', 
  'Miami, FL', 'Seattle, WA', 'Boston, MA', 'Denver, CO', 
  'Nashville, TN', 'Atlanta, GA'
];

export const CANNED_REPLIES = [
  'haha that\'s so true', 'same actually 😄', 'where are you from?', 
  'I love that', 'no way, really?', 'agreed honestly', 'lol right?', 
  'that\'s wild', 'fair point', 'totally', 'been thinking the same thing', 'ok that\'s funny'
];

export const EMOJIS = ['😊', '🤙', '😄', '👋', '🙌', '🤔', '😂', '😎', '👍', '✨'];

export const GREETINGS = [
  'hey! 👋', 'hi there!', 'what\'s up?', 'hey, where are you from?', 'hi! how\'s your day going?'
];

// Mock profile photos - using better Unsplash photos that work well in circles
export const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1599566150163-29194d4bd0f7?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&auto=format'
];

// Utility functions
export const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;
export const getRandomProfile = () => {
  const isMale = Math.random() > 0.4;
  const name = getRandomItem(isMale ? NAMES_M : NAMES_F);
  const age = getRandomNumber(21, 52);
  const location = getRandomItem(LOCATIONS);
  const interests = [getRandomItem(INTERESTS_ALL), getRandomItem(INTERESTS_ALL)]
    .filter((v, i, a) => a.indexOf(v) === i);
  const photo = getRandomItem(MOCK_PHOTOS);
  
  return {
    name: `${name}, ${age}`,
    location,
    interests,
    emoji: isMale ? getRandomItem(['😄', '🧑', '😊', '🤙', '😎']) : '👩',
    photo
  };
};
