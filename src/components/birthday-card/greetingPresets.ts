// Birthday greeting presets organized by category
export type GreetingCategory = "friends" | "family" | "colleagues" | "general";

export interface GreetingPreset {
  id: number;
  category: GreetingCategory;
  content: string;
}

export const greetingPresets: GreetingPreset[] = [
  // Friends (10 greetings)
  {
    id: 1,
    category: "friends",
    content: "Happy Birthday! May your day be filled with love and laughter!",
  },
  {
    id: 2,
    category: "friends",
    content: "Wishing you a day as special as you are! Happy Birthday!",
  },
  {
    id: 3,
    category: "friends",
    content:
      "Another year older, but still looking fabulous! Have a great one!",
  },
  {
    id: 4,
    category: "friends",
    content: "Hope your birthday is as amazing as you are to me!",
  },
  {
    id: 5,
    category: "friends",
    content: "Cheers to another year of wonderful memories together!",
  },
  {
    id: 6,
    category: "friends",
    content: "May all your birthday wishes come true! Enjoy your day!",
  },
  {
    id: 7,
    category: "friends",
    content: "Happy Birthday to one of my favorite people in the world!",
  },
  {
    id: 8,
    category: "friends",
    content: "Wishing you happiness and success in the year ahead!",
  },
  {
    id: 9,
    category: "friends",
    content: "Let's celebrate you today! Happy Birthday, my friend!",
  },
  {
    id: 10,
    category: "friends",
    content: "Here's to more adventures and good times ahead!",
  },

  // Family (10 greetings)
  {
    id: 11,
    category: "family",
    content: "Happy Birthday to the most wonderful Mom! Love you always!",
  },
  {
    id: 12,
    category: "family",
    content: "Dad, you're my hero! Wishing you the best birthday ever!",
  },
  {
    id: 13,
    category: "family",
    content: "Happy Birthday, Sis! You make life more fun every day!",
  },
  {
    id: 14,
    category: "family",
    content: "To my amazing brother - hope your birthday is epic!",
  },
  {
    id: 15,
    category: "family",
    content: "Grandma, you're one of a kind! Happy Birthday with love!",
  },
  {
    id: 16,
    category: "family",
    content: "Happy Birthday, Grandpa! Thanks for all the wisdom and love!",
  },
  {
    id: 17,
    category: "family",
    content: "Celebrating you today and always. You're the best!",
  },
  {
    id: 18,
    category: "family",
    content: "May your birthday be as warm and bright as your heart!",
  },
  {
    id: 19,
    category: "family",
    content: "So grateful to have you in my life. Happy Birthday!",
  },
  {
    id: 20,
    category: "family",
    content: "Family isn't complete without you. Have a wonderful day!",
  },

  // Colleagues (10 greetings)
  {
    id: 21,
    category: "colleagues",
    content: "Happy Birthday! Wishing you success and happiness ahead!",
  },
  {
    id: 22,
    category: "colleagues",
    content: "Hope your birthday is as amazing as you are. Enjoy!",
  },
  {
    id: 23,
    category: "colleagues",
    content: "Happy Birthday! Here's to another year of great achievements!",
  },
  {
    id: 24,
    category: "colleagues",
    content: "Wishing you a fantastic birthday and a wonderful year!",
  },
  {
    id: 25,
    category: "colleagues",
    content: "May your special day be filled with joy and celebration!",
  },
  {
    id: 26,
    category: "colleagues",
    content: "Happy Birthday! Thanks for being such a great colleague!",
  },
  {
    id: 27,
    category: "colleagues",
    content: "Hope you have a relaxing and enjoyable birthday!",
  },
  {
    id: 28,
    category: "colleagues",
    content: "Wishing you the best on your birthday and beyond!",
  },
  {
    id: 29,
    category: "colleagues",
    content:
      "Happy Birthday! Looking forward to another great year together!",
  },
  {
    id: 30,
    category: "colleagues",
    content: "Enjoy your special day - you deserve it!",
  },

  // General (10 greetings)
  {
    id: 31,
    category: "general",
    content: "Happy Birthday! Make it a day to remember!",
  },
  {
    id: 32,
    category: "general",
    content: "Wishing you joy, love, and all good things on your birthday!",
  },
  {
    id: 33,
    category: "general",
    content: "May this year bring you everything you've been hoping for!",
  },
  {
    id: 34,
    category: "general",
    content: "Happy Birthday! Here's to a year full of blessings!",
  },
  {
    id: 35,
    category: "general",
    content: "Celebrate big today - you deserve all the happiness!",
  },
  {
    id: 36,
    category: "general",
    content: "May your birthday be the start of a wonderful new chapter!",
  },
  {
    id: 37,
    category: "general",
    content: "Happy Birthday! Keep shining and spreading joy!",
  },
  {
    id: 38,
    category: "general",
    content: "Wishing you a day filled with love and beautiful moments!",
  },
  {
    id: 39,
    category: "general",
    content: "Happy Birthday! May your dreams and wishes come true!",
  },
  {
    id: 40,
    category: "general",
    content:
      "Another year, another reason to celebrate how amazing you are!",
  },
];

// Helper function to get greetings by category
export function getGreetingsByCategory(
  category: GreetingCategory
): GreetingPreset[] {
  return greetingPresets.filter((greeting) => greeting.category === category);
}

// Helper function to get all categories
export function getAllCategories(): GreetingCategory[] {
  return ["friends", "family", "colleagues", "general"];
}
