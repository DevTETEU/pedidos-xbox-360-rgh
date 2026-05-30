
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Categories mapping
const CATEGORIES = {
    ACTION: 'Ação',
    ADVENTURE: 'Aventura',
    RACING: 'Corrida',
    SPORTS: 'Esporte',
    RPG: 'RPG',
    SHOOTER: 'Tiro (FPS)',
    KIDS: 'Infantil'
};

const mapGenreToCategory = (genre) => {
    if (!genre) return CATEGORIES.ACTION;
    const g = genre.toLowerCase();

    if (g.includes('shooter') || g.includes('gun')) return CATEGORIES.SHOOTER;
    if (g.includes('action') && g.includes('adventure')) return CATEGORIES.ADVENTURE;
    if (g.includes('racing') || g.includes('driving') || g.includes('vehicle')) return CATEGORIES.RACING;
    if (g.includes('sports') || g.includes('football') || g.includes('soccer') || g.includes('wrestling') || g.includes('skating') || g.includes('golf') || g.includes('tennis')) return CATEGORIES.SPORTS;
    if (g.includes('rpg') || g.includes('role-playing')) return CATEGORIES.RPG;
    if (g.includes('platform') || g.includes('puzzle') || g.includes('party') || g.includes('music') || g.includes('dance') || g.includes('educational') || g.includes('family') || g.includes('quiz') || g.includes('simulation') || g.includes('strategy')) return CATEGORIES.KIDS;

    // Default fallback logic
    if (g.includes('adventure')) return CATEGORIES.ADVENTURE;
    if (g.includes('action') || g.includes('fighting') || g.includes('hack') || g.includes('beat')) return CATEGORIES.ACTION;

    return CATEGORIES.ACTION; // Catch-all
};

async function scrapeWikipedia(url) {
    console.log(`Fetching ${url}...`);
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);
        const games = [];

        // Find the correct table (usually class wikitable)
        $('table.wikitable tr').each((i, row) => {
            if (i === 0) return; // Skip header

            const cells = $(row).find('td');
            if (cells.length < 2) return;

            let title = $(cells[0]).text().trim();
            if (!title) {
                title = $(row).find('th').first().text().trim();
            }

            let genre = $(cells[1]).text().trim();

            // Clean up title (remove footnotes like [a])
            title = title.replace(/\[.*?\]/g, '');

            if (title && genre) {
                games.push({
                    nome: title,
                    categoria: mapGenreToCategory(genre)
                });
            }
        });

        console.log(`Found ${games.length} games on ${url}`);
        return games;
    } catch (e) {
        console.error(`Error fetching ${url}:`, e.message);
        return [];
    }
}

async function run() {
    const url1 = 'https://en.wikipedia.org/wiki/List_of_Xbox_360_games_(A%E2%80%93L)';
    const url2 = 'https://en.wikipedia.org/wiki/List_of_Xbox_360_games_(M%E2%80%93Z)';

    try {
        const games1 = await scrapeWikipedia(url1);
        const games2 = await scrapeWikipedia(url2);

        const allGames = [...games1, ...games2];
        console.log(`Total games found: ${allGames.length}`);

        // Unique filter by name
        const uniqueGames = Array.from(new Map(allGames.map(item => [item.nome, item])).values());
        console.log(`Unique games: ${uniqueGames.length}`);

        // Ensure directory exists
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const outputPath = path.join(dataDir, 'games.json');
        fs.writeFileSync(outputPath, JSON.stringify(uniqueGames, null, 2));
        console.log(`Saved to ${outputPath}`);

    } catch (error) {
        console.error('Error scraping games:', error);
    }
}

run();
