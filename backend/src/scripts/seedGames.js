const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    const gamesPath = path.join(__dirname, '../data/games.json');
    if (!fs.existsSync(gamesPath)) {
        console.error('Games data file not found!');
        process.exit(1);
    }

    const gamesData = JSON.parse(fs.readFileSync(gamesPath, 'utf-8'));
    console.log(`Read ${gamesData.length} games from JSON.`);

    // Delete existing games (optional, or just upsert)
    // For now, let's just createMany. If we run this multiple times, we might get duplicates if we don't clean up,
    // but since we just started, it's fine. 
    // Better: check if count is 0.
    const count = await prisma.game.count();
    if (count > 0) {
        console.log(`Database already has ${count} games. Skipping seed.`);
        return;
    }

    console.log('Seeding games...');

    // Batch insert to avoid too large query
    const batchSize = 100;
    for (let i = 0; i < gamesData.length; i += batchSize) {
        const batch = gamesData.slice(i, i + batchSize).map(g => ({
            nome: g.nome,
            categoria: g.categoria
        }));
        await prisma.game.createMany({
            data: batch
        });
        console.log(`inserted batch ${i} - ${i + batchSize}`);
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
