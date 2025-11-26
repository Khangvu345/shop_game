import { useState } from 'react';
import './AccordionItem.css';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

/**
 * Reusable AccordionItem component
 * Có thể mở/đóng để hiển thị nội dung
 */
export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="accordion-title">{title}</h3>
                <span className="accordion-icon">▼</span>
            </div>
            <div className="accordion-content">{children}</div>
        </div>
    );
}