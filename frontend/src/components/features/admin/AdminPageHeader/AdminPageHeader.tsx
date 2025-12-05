import './AdminPageHeader.css';

interface AdminPageHeaderProps {
    title: string;
}

export function AdminPageHeader({ title }: AdminPageHeaderProps) {
    return (
        <div className="admin-page-header">
            <span className="admin-logo-header">Admin</span>
            <h2 className="admin-page-title">{title}</h2>
        </div>
    );
}
