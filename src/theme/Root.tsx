import React, { useEffect } from 'react';

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Create backdrop element if it doesn't exist
    let backdrop = document.querySelector('.navbar-sidebar__backdrop') as HTMLElement;
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'navbar-sidebar__backdrop';
      document.body.appendChild(backdrop);
    }

    // Function to close the sidebar
    const closeSidebar = () => {
      document.documentElement.classList.remove('navbar-sidebar--show');
      document.body.classList.remove('navbar-sidebar--show');

      const sidebar = document.querySelector('.navbar-sidebar');
      if (sidebar) {
        sidebar.classList.remove('navbar-sidebar--show');
      }
    };

    // Auto-close mobile sidebar when clicking on a link
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicked on backdrop
      if (target.classList.contains('navbar-sidebar__backdrop')) {
        closeSidebar();
        return;
      }

      // Check if we're on mobile
      if (window.innerWidth >= 997) return;

      // Check if clicked element is inside the navbar sidebar
      const isInSidebar = target.closest('.navbar-sidebar');
      if (!isInSidebar) return;

      // Find the closest anchor element
      const linkElement = target.closest('a');
      if (!linkElement) return;

      // Check if it's a category toggle (has menu__link--sublist class or role="button")
      const isCategoryToggle = linkElement.classList.contains('menu__link--sublist') ||
                              linkElement.getAttribute('role') === 'button' ||
                              linkElement.getAttribute('aria-expanded') !== null;

      // If it's an actual navigation link (has href and not a toggle)
      if (linkElement.hasAttribute('href') && !isCategoryToggle) {
        // Small delay to allow navigation to start
        setTimeout(() => {
          closeSidebar();
        }, 150);
      }
    };

    // Add event listener
    document.addEventListener('click', handleClick, true);

    // Watch for sidebar state changes
    const observer = new MutationObserver(() => {
      const isOpen = document.body.classList.contains('navbar-sidebar--show') ||
                     document.documentElement.classList.contains('navbar-sidebar--show');

      if (backdrop) {
        if (isOpen) {
          backdrop.style.display = 'block';
        } else {
          backdrop.style.display = 'none';
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, true);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
