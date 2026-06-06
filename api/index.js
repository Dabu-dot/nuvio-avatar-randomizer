module.exports = async (req, res) => {
  try {
    // 1. On interroge l'API GitHub pour l'historique du dossier 'Avatars'
    const githubApiUrl = "https://api.github.com/repos/Dabu-dot/nuvio-avatar-randomizer/contents/Avatars";
    
    const dirResponse = await fetch(githubApiUrl, {
      headers: {
        'User-Agent': 'Vercel-Avatar-Randomizer'
      }
    });

    if (!dirResponse.ok) {
      return res.status(dirResponse.status).send(`Erreur API GitHub: ${dirResponse.statusText}`);
    }

    const files = await dirResponse.json();

    // 2. On filtre pour ne garder que les fichiers
    const gifFiles = files.filter(file => file.type === 'file');

    if (gifFiles.length === 0) {
      return res.status(404).send("Aucun fichier trouvé dans le dossier Avatars");
    }

    // 3. On choisit un fichier au hasard
    const randomFile = gifFiles[Math.floor(Math.random() * gifFiles.length)];
    const randomAvatarUrl = randomFile.download_url;

    // --- NOUVELLE LOGIQUE (PISTE 2) ---

    // 4. On génère une clé aléatoire unique pour détruire le cache (Cache-Busting)
    const cacheBuster = Math.random().toString(36).substring(2, 10);
    const finalUrl = `${randomAvatarUrl}?v=${cacheBuster}`;

    // 5. On configure des en-têtes anti-cache agressifs sur la redirection elle-même
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // 6. On redirige Nuvio instantanément (HTTP 302 Redirection Temporaire)
    // C'est Nuvio qui va télécharger directement le GIF depuis GitHub avec l'URL modifiée
    return res.redirect(302, finalUrl);

  } catch (error) {
    console.error("Crash de la fonction :", error);
    return res.status(500).send(`Erreur interne: ${error.message}`);
  }
};
