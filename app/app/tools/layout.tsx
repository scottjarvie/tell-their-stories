import Link from "next/link";
import { FileText, Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center space-x-4">
          <Link href="/app" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Source Processing Tools</h1>
        </div>
        <nav className="flex space-x-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/tools/format">
              <FileText className="mr-2 h-4 w-4" />
              Format
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/tools/analyze">
              <Brain className="mr-2 h-4 w-4" />
              Analyze
            </Link>
          </Button>
        </nav>
      </div>
      <div className="min-h-[calc(100vh-120px)]">
        {children}
      </div>
    </div>
  );
}
