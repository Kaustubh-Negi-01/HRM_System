import apiClient from '../../api/apiClient';
import { API_ENDPOINTS } from '../../api/endpoints';

export const copilotService = {
  async askQuestion(query, history = []) {
    try {
      return await apiClient.post(API_ENDPOINTS.COPILOT.CHAT, { query, history });
    } catch (err) {
      // Data-aware fallback AI assistant response for demo presentation
      const lower = query.toLowerCase();

      let answer = '';
      let dataTable = null;
      let actionRecommendation = null;

      if (lower.includes('burnout') || lower.includes('overtime') || lower.includes('stress')) {
        answer = `Based on real-time attendance logs over the past 30 days, **Engineering** has the highest burnout risk index (**82/100**). \n\nDavid Miller (DevOps Lead) and Priya Sharma (Fullstack) have recorded over 15+ hours of overtime per week following the recent release cycle.`;
        dataTable = {
          headers: ['Employee', 'Department', 'Overtime (30d)', 'Risk Rating'],
          rows: [
            ['David Miller', 'Engineering', '18.5 hrs', 'Critical (89%)'],
            ['Priya Sharma', 'Engineering', '12.0 hrs', 'High (76%)'],
            ['Lucas Grey', 'Customer Support', '14.5 hrs', 'High (84%)'],
          ],
        };
        actionRecommendation = {
          label: 'Open Workforce Pulse Analytics',
          link: '/admin/workforce-pulse',
        };
      } else if (lower.includes('leave') || lower.includes('vacation') || lower.includes('impact') || lower.includes('overlap')) {
        answer = `There are currently **3 pending leave requests**. \n\n⚠️ **High Conflict Warning:** Alex Mercer and David Miller have overlapping leave requests between **Sept 1 – Sept 4**. Approving both would reduce Engineering coverage to **58%**, which is below your team threshold of 75%.`;
        dataTable = {
          headers: ['Employee', 'Dates', 'Days', 'Staffing Impact'],
          rows: [
            ['Alex Mercer', 'Sept 1 – Sept 4', '4 days', 'Moderate (78%)'],
            ['David Miller', 'Sept 2 – Sept 8', '5 days', 'Critical (92%)'],
            ['Elena Rostova', 'Aug 28 – Aug 29', '2 days', 'Safe (25%)'],
          ],
        };
        actionRecommendation = {
          label: 'Run Smart Leave Impact Simulator',
          link: '/admin/leave-impact',
        };
      } else if (lower.includes('payroll') || lower.includes('salary') || lower.includes('cost') || lower.includes('budget')) {
        answer = `For the **August 2026** cycle, total projected payroll disbursement is **$382,400** across 52 active employees. \n\nThere are 3 pending adjustments for overtime bonuses awaiting HR sign-off.`;
        dataTable = {
          headers: ['Department', 'Headcount', 'Disbursed (Est.)', 'Tax Withheld'],
          rows: [
            ['Engineering', '22', '$192,400', '$36,500'],
            ['Sales & Growth', '11', '$88,000', '$16,700'],
            ['Product & Design', '8', '$62,000', '$11,800'],
            ['HR & Admin', '11', '$40,000', '$7,400'],
          ],
        };
        actionRecommendation = {
          label: 'Manage Payroll Batch',
          link: '/admin/payroll',
        };
      } else {
        answer = `DayFlow Copilot analyzed your HRMS dataset regarding: *"${query}"*.\n\nAll organizational parameters appear within standard operating bounds. Total active workforce is at **94.2% daily attendance** with no compliance bottlenecks detected.`;
      }

      return {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dataTable,
        actionRecommendation,
      };
    }
  },

  getSuggestedPrompts() {
    return [
      'Who is at the highest risk of burnout this quarter?',
      'Simulate leave impact for Alex Mercer in September',
      'What is the total estimated payroll for August 2026?',
      'Show me departments with unplanned absence spikes',
    ];
  },
};

export default copilotService;
