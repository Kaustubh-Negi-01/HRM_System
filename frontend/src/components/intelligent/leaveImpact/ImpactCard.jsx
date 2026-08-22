import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { RiskBadge } from '../../shared/RiskBadge';
import { ArrowRight, AlertTriangle, Users, Calendar } from 'lucide-react';
import './ImpactCard.css';

export const ImpactCard = ({
  employeeName,
  department,
  dates,
  currentCoverage = 92,
  projectedCoverage = 67,
  riskLevel = 'HIGH',
  overlappingLeaves = 2,
  recommendation,
  onApprove,
  onReject,
  loading = false,
  className = '',
}) => {
  const coverageDelta = projectedCoverage - currentCoverage;
  const isHighRisk = String(riskLevel).toLowerCase() === 'high' || String(riskLevel).toLowerCase() === 'critical';

  return (
    <Card className={`df-impact-card ${isHighRisk ? 'df-impact-card--risk' : ''} ${className}`}>
      {/* Header Info */}
      <div className="df-impact-card__header">
        <div className="df-impact-card__employee">
          <h4 className="df-impact-card__name">{employeeName || 'Leave Request'}</h4>
          <span className="df-impact-card__dept">{department}</span>
        </div>
        <RiskBadge level={riskLevel} />
      </div>

      {dates && (
        <div className="df-impact-card__dates">
          <Calendar size={14} />
          <span>{dates}</span>
        </div>
      )}

      {/* Coverage Projection Row */}
      <div className="df-impact-card__projection">
        <div className="df-impact-card__metric">
          <span className="df-impact-card__metric-label">Current Coverage</span>
          <span className="df-impact-card__metric-value table-num">{currentCoverage}%</span>
        </div>

        <div className="df-impact-card__arrow">
          <ArrowRight size={18} />
          <span className={`df-impact-card__delta table-num ${coverageDelta < 0 ? 'df-impact-card__delta--neg' : ''}`}>
            {coverageDelta > 0 ? `+${coverageDelta}%` : `${coverageDelta}%`}
          </span>
        </div>

        <div className="df-impact-card__metric">
          <span className="df-impact-card__metric-label">Projected Coverage</span>
          <span className="df-impact-card__metric-value df-impact-card__metric-value--projected table-num">
            {projectedCoverage}%
          </span>
        </div>
      </div>

      {/* Context Badges */}
      <div className="df-impact-card__context">
        <div className="df-impact-card__context-item">
          <Users size={14} />
          <span><strong>{overlappingLeaves}</strong> overlapping team leaves</span>
        </div>
      </div>

      {/* Recommendation Notice */}
      {recommendation && (
        <div className={`df-impact-card__recommendation ${isHighRisk ? 'df-impact-card__recommendation--warning' : ''}`}>
          <AlertTriangle size={15} />
          <p>{recommendation}</p>
        </div>
      )}

      {/* Action Buttons */}
      {(onApprove || onReject) && (
        <div className="df-impact-card__actions">
          {onReject && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReject}
              disabled={loading}
            >
              Reject
            </Button>
          )}
          {onApprove && (
            <Button
              variant={isHighRisk ? 'danger' : 'primary'}
              size="sm"
              onClick={onApprove}
              loading={loading}
            >
              Approve Leave
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default ImpactCard;
