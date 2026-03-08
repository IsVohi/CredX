export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-grow pt-24 pb-8">
            {children}
        </main>
    );
}
