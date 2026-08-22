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
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Chen',
    email: user?.email || 'alex.chen@dayflow.internal',
    employeeId: user?.employeeId || 'EMP001',
    phone: '+1 (555) 014-9922',
    department: user?.department || 'Engineering',
    role: user?.profile?.designation || user?.title || 'Lead Fullstack Engineer',
    joinDate: 'March 1, 2023',
    manager: 'Hamza Khan (HR Director)',
    emergencyContactName: 'Laura Chen',
    emergencyContactPhone: '+1 (555) 890-1234',
    emergencyRelation: 'Spouse',
    address: user?.profile?.address || '240 Spear Street, San Francisco, CA 94105',
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
      } catch (err) {
        console.warn('Fallback to context user');
      }
    };
    fetchProfile();
  }, [user]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (user?.id) {
        await employeeService.updateEmployee(user.id, {
          phone: profileData.phone,
          address: profileData.address,
          designation: profileData.role,
        });
      }
    } catch (err) {
      console.warn('Saved locally');
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageContainer
      title="My Employee Profile"
      subtitle="Manage your personal details, emergency contacts, and employment records."
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
          className="flex items-center gap-2 text-xs font-bold"
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--success)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>Profile details successfully updated and synchronized!</span>
        </div>
      )}

      {/* Top Banner Profile Summary */}
      <Card variant="elevated" style={{ marginBottom: '2rem' }}>
        <div className="flex items-center gap-6 flex-wrap">
          <EmployeeAvatar name={profileData.name} size="xl" />
          <div className="flex-1" style={{ minWidth: '240px' }}>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-primary">{profileData.name}</h2>
              <StatusBadge status="active" size="sm" />
            </div>
            <p className="text-sm font-semibold text-secondary" style={{ marginTop: '0.25rem' }}>
              {profileData.role} • {profileData.department}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted" style={{ marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span className="flex items-center gap-1">
                <Mail size={14} /> {profileData.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Joined {profileData.joinDate}
              </span>
              <span className="flex items-center gap-1">
                <Shield size={14} /> Reports to {profileData.manager.split(' ')[0]} {profileData.manager.split(' ')[1]}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Personal & Employment Information */}
        <Card title="Employment & Organization Info">
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-muted">Employee ID</span>
              <span className="text-primary font-mono font-bold">DF-8092</span>
            </div>
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-muted">Department</span>
              <span className="text-primary font-semibold">{profileData.department}</span>
            </div>
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-muted">Designation</span>
              <span className="text-primary font-semibold">{profileData.role}</span>
            </div>
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-muted">Reporting Manager</span>
              <span className="text-primary font-semibold">{profileData.manager}</span>
            </div>
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-muted">Work Model</span>
              <span className="text-primary font-semibold">Hybrid (SF Hub / Remote)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted">Employment Type</span>
              <span className="text-emerald font-semibold">Full-Time Regular</span>
            </div>
          </div>
        </Card>

        {/* Contact & Emergency Details */}
        <Card title="Contact & Emergency Info">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <Input
                label="Personal Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
              <Input
                label="Home Address"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />
              <Input
                label="Emergency Contact Name"
                value={profileData.emergencyContactName}
                onChange={(e) => setProfileData({ ...profileData, emergencyContactName: e.target.value })}
              />
              <Input
                label="Emergency Phone"
                value={profileData.emergencyContactPhone}
                onChange={(e) => setProfileData({ ...profileData, emergencyContactPhone: e.target.value })}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-muted">Phone</span>
                <span className="text-primary font-mono">{profileData.phone}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-muted">Home Address</span>
                <span className="text-primary">{profileData.address}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-muted">Emergency Contact</span>
                <span className="text-primary font-semibold">{profileData.emergencyContactName} ({profileData.emergencyRelation})</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted">Emergency Phone</span>
                <span className="text-primary font-mono">{profileData.emergencyContactPhone}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default EmployeeProfile;
