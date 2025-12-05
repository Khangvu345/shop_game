
type IconProps = React.SVGProps<SVGSVGElement>;
export function MailIcon(props: IconProps) {
    return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
    );
}
export function PasswordIcon(props: IconProps) {
    return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
  );
}
export function UserIcon(props: IconProps) {
    return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
  );
}
export function PhoneIcon(props: IconProps) {
  return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3 5.18 
             2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.81.37 1.6.72 2.34a2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.83-.27a2 2 0 0 1 2.11.45c.74.35 1.53.6 2.34.72A2 2 0 0 1 22 16.92z"/>
  </svg>
);
}  