export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Gloryland Food & Pub Joint. All Rights Reserved.
      </div>
    </footer>
  );
}