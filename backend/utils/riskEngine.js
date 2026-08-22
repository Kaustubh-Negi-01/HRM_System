const { RISK_LEVEL } = require('./constants');

/**
 * THRESHOLDS CONFIGURATION
 * Easy to adjust and audit by judges/team
 */
const THRESHOLDS = {
  // Workforce Pulse Thresholds
  WORKFORCE: {
    HIGH_ABSENCE_RATE: 20,     // > 20% absence rate triggers HIGH risk
    MEDIUM_ABSENCE_RATE: 10,   // > 10% absence rate triggers MEDIUM risk
    LOW_COVERAGE_RATE: 75,     // < 75% coverage triggers HIGH risk
    MEDIUM_COVERAGE_RATE: 85   // < 85% coverage triggers MEDIUM risk
  },
  // Smart Leave Impact Thresholds
  LEAVE_IMPACT: {
    CRITICAL_COVERAGE: 60,     // Projected department coverage < 60% is HIGH risk
    WARNING_COVERAGE: 75,      // Projected department coverage < 75% is MEDIUM risk
    MAX_OVERLAPPING_WARN: 2    // >= 2 concurrent leaves in same team triggers warning
  }
};

/**
 * Calculate overall workforce risk level deterministically
 * @param {number} attendancePercentage
 * @param {number} teamCoverage
 * @param {number} absenceRate
 * @param {number} leaveLoad
 * @returns {{ riskLevel: string, reasons: string[] }}
 */
function evaluateWorkforceRisk(attendancePercentage, teamCoverage, absenceRate, leaveLoad) {
  const reasons = [];
  let riskScore = 0; // 0 = LOW, 1-2 = MEDIUM, 3+ = HIGH

  if (absenceRate >= THRESHOLDS.WORKFORCE.HIGH_ABSENCE_RATE) {
    riskScore += 3;
    reasons.push(`High absence rate (${absenceRate}%) exceeds critical threshold of ${THRESHOLDS.WORKFORCE.HIGH_ABSENCE_RATE}%.`);
  } else if (absenceRate >= THRESHOLDS.WORKFORCE.MEDIUM_ABSENCE_RATE) {
    riskScore += 1;
    reasons.push(`Moderate absence rate (${absenceRate}%) above warning threshold of ${THRESHOLDS.WORKFORCE.MEDIUM_ABSENCE_RATE}%.`);
  }

  if (teamCoverage < THRESHOLDS.WORKFORCE.LOW_COVERAGE_RATE) {
    riskScore += 3;
    reasons.push(`Overall team coverage (${teamCoverage}%) is below minimum safe threshold of ${THRESHOLDS.WORKFORCE.LOW_COVERAGE_RATE}%.`);
  } else if (teamCoverage < THRESHOLDS.WORKFORCE.MEDIUM_COVERAGE_RATE) {
    riskScore += 1;
    reasons.push(`Overall team coverage (${teamCoverage}%) is lower than ideal target (${THRESHOLDS.WORKFORCE.MEDIUM_COVERAGE_RATE}%).`);
  }

  if (leaveLoad > 25) {
    riskScore += 1;
    reasons.push(`High leave load with ${leaveLoad}% of staff currently scheduled on leave.`);
  }

  let riskLevel = RISK_LEVEL.LOW;
  if (riskScore >= 3) {
    riskLevel = RISK_LEVEL.HIGH;
  } else if (riskScore >= 1) {
    riskLevel = RISK_LEVEL.MEDIUM;
  }

  if (reasons.length === 0) {
    reasons.push('Workforce health is stable with healthy attendance and department coverage.');
  }

  return { riskLevel, reasons };
}

/**
 * Evaluate projected leave impact risk deterministically
 * @param {Object} params
 * @param {string} params.department
 * @param {number} params.teamSize
 * @param {number} params.currentCoverage
 * @param {number} params.projectedCoverage
 * @param {number} params.overlappingLeaves
 * @returns {{ riskLevel: string, reason: string }}
 */
function evaluateLeaveImpactRisk({ department, teamSize, currentCoverage, projectedCoverage, overlappingLeaves }) {
  let riskLevel = RISK_LEVEL.LOW;
  let reason = `Approval keeps ${department} team coverage healthy at ${projectedCoverage}%.`;

  if (projectedCoverage < THRESHOLDS.LEAVE_IMPACT.CRITICAL_COVERAGE) {
    riskLevel = RISK_LEVEL.HIGH;
    reason = `Approval would reduce ${department} team coverage to ${projectedCoverage}%, breaching the critical ${THRESHOLDS.LEAVE_IMPACT.CRITICAL_COVERAGE}% floor.`;
  } else if (projectedCoverage < THRESHOLDS.LEAVE_IMPACT.WARNING_COVERAGE || overlappingLeaves >= THRESHOLDS.LEAVE_IMPACT.MAX_OVERLAPPING_WARN) {
    riskLevel = RISK_LEVEL.MEDIUM;
    reason = `Approval would lower ${department} coverage to ${projectedCoverage}% with ${overlappingLeaves} concurrent leave(s) on those dates.`;
  }

  return { riskLevel, reason };
}

module.exports = {
  THRESHOLDS,
  evaluateWorkforceRisk,
  evaluateLeaveImpactRisk
};
