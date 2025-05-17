// app/testregister/layout.tsx
'use client';

import TestNavbar from "../testcomponents/TestNavbar";

export default function TestRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // render only your TestNavbar (no global header)
  return (
    <>
      {/* you can even guard it by login if you like */}
      {typeof window !== 'undefined' &&
        localStorage.getItem('userEmail') && (
          <TestNavbar />
        )}
      {children}
    </>
  );
}
