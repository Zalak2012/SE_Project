import React from 'react';

const PageHeader = ({ title }) => (
    <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500">Manage and oversee the {title.toLowerCase()} operations.</p>
    </div>
);

export const ManageUsers = () => (
    <div>
        <PageHeader title="Manage Users" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center text-gray-400">
            User management table will appear here
        </div>
    </div>
);

export const DoctorApprovals = () => (
    <div>
        <PageHeader title="Doctor Approvals" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center text-gray-400">
            Doctor approval queue will appear here
        </div>
    </div>
);

export const AdminAppointments = () => (
    <div>
        <PageHeader title="Appointments" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center text-gray-400">
            System-wide appointments list will appear here
        </div>
    </div>
);

export const Analytics = () => (
    <div>
        <PageHeader title="Analytics" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center text-gray-400">
            Comprehensive platform analytics will appear here
        </div>
    </div>
);
