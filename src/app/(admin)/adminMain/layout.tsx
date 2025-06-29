// src/app/(user)/userPage/layout.tsx
"use client";
import React from "react";
import Sidebar from "@/components/ui/Sidebars/Admin";
import styles from "@/styles/adminPage.module.css";
import Footer from "@/components/ui/Footer";
import { UserProvider, useUser } from "@/context/userIDContext";


function InnerLayout({ children }: { children: React.ReactNode }) {
	const { refreshUser } = useUser();

	React.useEffect(() => {
		// Refresh user data on component mount
		refreshUser();
	}, [refreshUser]);

	return (
		<>
			<Sidebar />
			<main className={styles.mainContent}>{children}</main>
			<Footer />
		</>
	);
}

export default function UserPageLayout({children,}: {children: React.ReactNode;}) {

	return (
		<div className={styles.container}>
				<UserProvider>
					<InnerLayout>
						{children}
					</InnerLayout> 
				</UserProvider>
		</div>
	);
}
