// La liste des GIFs d'avatars
const avatars = [
  "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/Im%20watching%20you.gif",
  "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/Rick.gif",
  "https://raw.githubusercontent.com/Dabu-dot/nuvio-avatar-randomizer/refs/heads/main/Avatars/SpongeBob.gif"
];

export default function handler(req, res) {
  // Sélectionne un GIF au hasard dans la liste
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  // CRUCIAL : On dit à Nuvio de NE PAS garder le GIF en cache
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // On redirige instantanément Nuvio vers le GIF choisi
  res.redirect(302, randomAvatar);
}