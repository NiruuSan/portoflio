export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="cursor-auto">
      {children}
    </div>
  )
}
