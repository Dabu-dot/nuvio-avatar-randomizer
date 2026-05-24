// Remplace par tes vrais liens raw GitHub
const avatars = [
  "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/Im%20watching%20you.gif",
  "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/Rick.gif",
  "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/SpongeBob.gif"
];

export default async function handler(req, res) {
  try {
    // 1. Sélection du GIF au hasard
    const randomAvatarUrl = avatars[Math.floor(Math.random() * avatars.length)];

    // 2. Vercel va chercher lui-même le fichier sur GitHub
    const response = await fetch(randomAvatarUrl);
    
    if (!response.ok) throw new Error("Impossible de récupérer le GIF");

    // 3. On récupère le contenu de l'image sous forme de buffer (octets)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. On configure les en-têtes pour forcer le navigateur à comprendre que c'est un GIF
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // 5. On renvoie directement l'image
    return res.status(200).send(buffer);

  } catch (error) {
    console.error(error);
    // En cas de problème, on renvoie une erreur 500
    return res.status(500).json({ error: "Erreur lors du chargement de l'avatar" });
  }
}
