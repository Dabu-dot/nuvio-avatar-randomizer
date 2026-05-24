const avatars = [
    "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/Im%20watching%20you.gif",
    "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/Rick.gif",
    "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/SpongeBob.gif"
];

module.exports = async (req, res) => {
  try {
    // 1. Choix du GIF
    const randomAvatarUrl = avatars[Math.floor(Math.random() * avatars.length)];

    // 2. Fetch natif (Node.js moderne sur Vercel le gère sans require)
    const response = await fetch(randomAvatarUrl);
    
    if (!response.ok) {
      return res.status(response.status).send(`Erreur GitHub: ${response.statusText}`);
    }

    // 3. Extraction propre des données binaires
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. En-têtes HTTP anti-cache
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // 5. Envoi du fichier binaire
    return res.status(200).send(buffer);

  } catch (error) {
    console.error("Crash de la fonction :", error);
    return res.status(500).send(`Erreur interne: ${error.message}`);
  }
};
