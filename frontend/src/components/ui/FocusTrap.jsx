import React, { useEffect, useRef } from 'react';

const FocusTrap = ({ children, isActive = true }) => {
    const rootRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;

            const root = rootRef.current;
            if (!root) return;

            const focusableElements = root.querySelectorAll(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        const root = rootRef.current;
        if (root) {
            // Focus the first element when activated
            const focusableElements = root.querySelectorAll(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }

            root.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (root) {
                root.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [isActive]);

    return (
        <div ref={rootRef} tabIndex="-1" className="outline-none">
            {children}
        </div>
    );
};

export default FocusTrap;
