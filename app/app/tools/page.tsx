import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Brain, ArrowRight } from "lucide-react";

export default function ToolsIndexPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Process Your Research</h2>
        <p className="text-muted-foreground text-lg">
          Transform raw FamilySearch data into professional research dossiers in two steps.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <CardTitle>Step 1: Format</CardTitle>
            <CardDescription>
              Clean and organize raw data extracted from FamilySearch.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="text-sm text-muted-foreground">
              Paste the JSON from the browser extension. This tool will strip out website UI text, organize sources, and format everything into clean Markdown.
            </p>
            <div className="mt-auto pt-4">
              <Button asChild className="w-full">
                <Link href="/app/tools/format">
                  Go to Format Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <CardTitle>Step 2: Analyze</CardTitle>
            <CardDescription>
              Generate a contextualized research dossier with AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="text-sm text-muted-foreground">
              Paste the formatted Markdown from Step 1. The AI acts as a professional genealogist to analyze evidence, find conflicts, and suggest research steps.
            </p>
            <div className="mt-auto pt-4">
              <Button asChild variant="secondary" className="w-full">
                <Link href="/app/tools/analyze">
                  Go to Analyze Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
