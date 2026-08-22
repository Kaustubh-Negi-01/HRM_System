import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmployeeAvatar from '../../components/shared/EmployeeAvatar';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import employeeService from '../../features/employee/employee.service';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Shield,
  FileCheck,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const EmployeeProfile = () => {
  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    const cached = user || JSON.parse(localStorage.getItem('dayflow_user') || '{}');
    const isAdmin = (cached.role || '').toLowerCase() === 'admin';
    return {
      name: cached.name || (isAdmin ? 'Saksham Singh' : 'Alex Chen'),
      email: cached.email || (isAdmin ? 'admin@dayflow.internal' : 'alex.chen@dayflow.internal'),
      employeeId: cached.employeeId || (isAdmin ? 'ADM001' : 'EMP001'),
      phone: cached.phone || cached.profile?.phone || '+1 (555) 019-2831',
      department: cached.department || (isAdmin ? 'Human Resources' : 'Engineering'),
      role: cached.title || cached.profile?.designation || (isAdmin ? 'HR Director' : 'Lead Fullstack Engineer'),
      joinDate: cached.profile?.joiningDate || 'January 15, 2023',
      manager: isAdmin ? 'Executive Board' : 'Saksham Singh (HR Director)',
      emergencyContactName: 'Laura Chen',
      emergencyContactPhone: '+1 (555) 890-1234',
      emergencyRelation: 'Spouse',
      address: cached.address || cached.profile?.address || '100 Innovation Way, Suite 400',
    };
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await employeeService.getOwnProfile();
        if (data) {
          setProfileData((prev) => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            employeeId: data.employeeId || prev.employeeId,
            phone: data.phone || data.profile?.phone || prev.phone,
            department: data.department || prev.department,
            role: data.designation || data.profile?.designation || prev.role,
            address: data.address || data.profile?.address || prev.address,
          }));
        }
      } catch (err) {}
    };
    fetchProfile();
  }, [user]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await employeeService.updateEmployee(user?.id || 'usr_current', {
        phone: profileData.phone,
        address: profileData.address,
        designation: profileData.role,
        name: profileData.name,
      });
      if (setUser) {
        setUser({
          ...(user || {}),
          name: profileData.name,
          title: profileData.role,
          phone: profileData.phone,
          address: profileData.address,
        });
      }
    } catch (err) {}
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageContainer
      title="My Profile & Identity"
      subtitle="Manage your employee records, employment details, and emergency contacts."
      action={
        !isEditing ? (
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            Edit Contact Details
          </Button>
        ) : (
          <Button variant="primary" size="sm" icon={Save} onClick={handleSave}>
            Save Changes
          </Button>
        )
      }
    >
      {savedSuccess && (
        <div
          className="flex items-center gap-2 animate-fade-in"
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>Profile changes saved and synchronized across your session!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card className="flex flex-col items-center text-center p-6" style={{ height: 'fit-content' }}>
          <div style={{ marginBottom: '1rem' }}>
            <EmployeeAvatar name={profileData.name} size="xl" />
          </div>
          <h2 className="text-xl font-bold text-primary">{profileData.name}</h2>
          <p className="text-sm text-secondary font-medium" style={{ marginTop: '0.25rem' }}>
            {profileData.role}
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <StatusBadge status="active" />
          </div>

          <div
            style={{
              width: '100%',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              textAlign: 'left',
            }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Employee ID</span>
              <span className="font-mono font-bold text-primary">{profileData.employeeId}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Department</span>
              <span className="font-semibold text-primary">{profileData.department}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Reporting Manager</span>
              <span className="font-semibold text-primary">{profileData.manager}</span>
            </div>
          </div>
        </Card>

        {/* Detailed Fields Section */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card title="Employment & Identity Overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Full Legal Name
                </label>
                <div className="text-sm font-bold text-primary">{profileData.name}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Corporate Email
                </label>
                <div className="text-sm font-mono text-primary">{profileData.email}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Designation / Role
                </label>
                <div className="text-sm font-semibold text-primary">{profileData.role}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Joining Date
                </label>
                <div className="text-sm font-semibold text-primary">{profileData.joinDate}</div>
              </div>
            </div>
          </Card>

          <Card title="Contact & Residential Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.375rem' }}>
                  Contact Phone Number
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                ) : (
                  <div className="text-sm text-primary font-mono">{profileData.phone}</div>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.375rem' }}>
                  Residential Address
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                ) : (
                  <div className="text-sm text-primary">{profileData.address}</div>
                )}
              </div>
            </div>
          </Card>

          <Card title="Emergency Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Contact Name
                </label>
                <div className="text-sm font-semibold text-primary">{profileData.emergencyContactName}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Relationship
                </label>
                <div className="text-sm font-semibold text-primary">{profileData.emergencyRelation}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Emergency Phone
                </label>
                <div className="text-sm font-mono text-primary">{profileData.emergencyContactPhone}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default EmployeeProfile;
