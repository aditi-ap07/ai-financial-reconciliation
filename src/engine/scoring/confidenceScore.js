/** confidence score based on match rate */
export default function confidenceScore(matchRate) {
  if (matchRate > 95) return 0.98;
  if (matchRate > 90) return 0.92;
  if (matchRate > 80) return 0.85;
  return 0.7;
}
