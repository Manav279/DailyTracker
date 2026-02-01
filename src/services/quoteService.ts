export interface Quote {
    text: string;
    author: string;
}

const quotes: Quote[] = [
    { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
    { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
    { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
    { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
    { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca" },
    { text: "The best revenge is not to be like your enemy.", author: "Marcus Aurelius" },
    { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart.", author: "Marcus Aurelius" },
    { text: "If you don't know where you are sailing, no wind is favorable.", author: "Seneca" },
    { text: "Man is not worried by real problems so much as by his imagined anxieties about real problems.", author: "Epictetus" },
    { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
    { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "Success is simple. Do what's right, the right way, at the right time.", author: "Arnold H. Glasow" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "I never dreamt of success. I worked for it.", author: "Estée Lauder" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
    { text: "The glow of one warm thought is to me worth more than money.", author: "Thomas Jefferson" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "A year from now you will wish you had started today.", author: "Karen Lamb" },
    { text: "Make each day your masterpiece.", author: "John Wooden" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Do not wait; the time will never be 'just right'.", author: "Napoleon Hill" },
    { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" }
];

export const quoteService = {
    getDailyQuote(): Quote {
        const today = new Date();
        // Use full date string to seed the index
        const dateStr = today.toDateString();

        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
        }

        const index = Math.abs(hash) % quotes.length;
        return quotes[index]!;
    }
};
