const fetch = require('node-fetch'); // Inclus par défaut dans l'environnement Vercel

const avatars = [
    "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/Im%20watching%20you.gif",
  "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/Rick.gif",
  "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/SpongeBob.gif"
];

module.exports = async (req, res) => {
  try {
    const randomAvatarUrl = avatars[Math.floor(Math.random() * avatars.length)];

    const response = await fetch(randomAvatarUrl);
    if (!response.ok) throw new Error("Impossible de récupérer le GIF sur GitHub");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // En-têtes indispensables pour Nuvio
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erreur de chargement");
  }
};