function CrowdBadge({ crowd = 'LOW' }) {
  const normalized = (crowd || 'LOW').toUpperCase();
  return (
    <span className={`crowd-badge crowd-${normalized.toLowerCase()}`}>
      {normalized}
    </span>
  );
}

export default CrowdBadge;
