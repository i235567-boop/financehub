import './RiskBadge.css';

/**
 * RiskBadge component displays risk level with color coding
 * Props:
 * - riskLevel: 'low' | 'medium' | 'high'
 * - size: 'small' | 'medium' | 'large' (optional)
 */
export default function RiskBadge({ riskLevel, size = 'medium' }) {
  const getRiskClass = () => {
    const baseClass = 'risk-badge';
    const sizeClass = `risk-badge-${size}`;
    const colorClass = `risk-${riskLevel}`;
    return `${baseClass} ${sizeClass} ${colorClass}`;
  };
  
  const getRiskLabel = () => {
    return riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1) + ' Risk';
  };
  
  return (
    <span className={getRiskClass()}>
      {getRiskLabel()}
    </span>
  );
}
