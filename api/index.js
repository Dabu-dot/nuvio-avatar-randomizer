module.exports = async (req, res) => {
  try {
    // 1. On interroge l'API GitHub pour l'historique du dossier 'Avatars'
    // L'API nous renvoie la liste de tous les fichiers présents dans ce dossier
    const githubApiUrl = "https://api.github.com/repos/Dabu-dot/nuvio-avatar-randomizer/contents/Avatars";
    
    const dirResponse = await fetch(githubApiUrl, {
      headers: {
        // GitHub demande un User-Agent pour utiliser son API publique
        'User-Agent': 'Vercel-Avatar-Randomizer'
      }
    });

    if (!dirResponse.ok) {
      return res.status(dirResponse.status).send(`Erreur API GitHub: ${dirResponse.statusText}`);
    }

    const files = await dirResponse.json();

    // 2. On filtre pour ne garder que les fichiers (au cas où il y a un sous-dossier cachés)
    const gifFiles = files.filter(file => file.type === 'file');

    if (gifFiles.length === 0) {
      return res.status(404).send("Aucun fichier trouvé dans le dossier Avatars");
    }

    // 3. On choisit un fichier au hasard
    const randomFile = gifFiles[Math.floor(Math.random() * gifFiles.length)];
    
    // L'API GitHub nous donne directement l'URL brute idéale dans 'download_url'
    // (Elle gère elle-même les espaces et caractères spéciaux !)
    const randomAvatarUrl = randomFile.download_url;

    // 4. Récupération des données binaires de l'image choisie
    const response = await fetch(randomAvatarUrl);
    
    if (!response.ok) {
      return res.status(response.status).send(`Erreur téléchargement GIF: ${response.statusText}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. En-têtes HTTP anti-cache
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // 6. Envoi du fichier binaire
    return res.status(200).send(buffer);

  } catch (error) {
    console.error("Crash de la fonction :", error);
    return res.status(500).send(`Erreur interne: ${error.message}`);
  }
};
