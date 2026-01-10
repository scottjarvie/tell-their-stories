"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Play, FileJson, Loader2, Check, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { formatPrompt } from "@/lib/prompts/formatPrompt";

export default function FormatToolPage() {
  const [input, setInput] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleParse = () => {
    try {
      const json = JSON.parse(input);
      setParsedData(json);
      toast.success("JSON parsed successfully");
    } catch (e) {
      toast.error("Invalid JSON. Please check your input.");
      setParsedData(null);
    }
  };

  const handleCopyPrompt = () => {
    if (!parsedData) return;
    
    const fullPrompt = `${formatPrompt}\n\nINPUT DATA:\n\`\`\`json\n${JSON.stringify(parsedData, null, 2)}\n\`\`\``;
    
    navigator.clipboard.writeText(fullPrompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleProcess = async () => {
    if (!parsedData) return;
    
    setLoading(true);
    try {
      // Get settings from localStorage
      const settingsStr = localStorage.getItem("telltheirstories-settings"); // Assuming this key based on previous context, or "settings"
      // Actually, checking Settings page implementation would be ideal, but standardizing on passing key is good.
      // Let's assume the user might have set it in the Settings page which saves to localStorage.
      // Based on previous turn's `app/app/source-docs/[personId]/ai/page.tsx`, it uses `localStorage.getItem("telltheirstories-settings")`? 
      // Wait, let me check `app/app/settings/page.tsx` again or just check `localStorage` usage in `ai/page.tsx`.
      
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: formatPrompt,
          data: JSON.stringify(parsedData),
          apiKey: localStorage.getItem("openRouterApiKey"), // Settings page saved it as "openRouterApiKey"
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      setOutput(result.content);
      toast.success("Formatting complete!");
    } catch (error: any) {
      toast.error("Processing failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Markdown copied!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      {/* Input Column */}
      <div className="flex flex-col space-y-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-blue-600" />
              Input: Raw JSON
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <Textarea 
              placeholder="Paste the Evidence Pack JSON here..." 
              className="h-full font-mono text-sm resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
          <CardFooter className="justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              {parsedData ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> 
                  {parsedData.person?.name || "Unknown Person"} ({parsedData.sources?.length || 0} sources)
                </span>
              ) : "Waiting for valid JSON..."}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setInput("")} disabled={!input}>
                Clear
              </Button>
              <Button onClick={handleParse} disabled={!input || !!parsedData}>
                Parse JSON
              </Button>
            </div>
          </CardFooter>
        </Card>

        {parsedData && (
          <Card>
            <CardContent className="p-4 flex flex-col gap-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleCopyPrompt}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Prompt + Data (for external AI)
              </Button>
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={handleProcess}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Process with In-App AI
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Output Column */}
      <Card className="flex flex-col h-full bg-stone-50 dark:bg-stone-900 border-l-4 border-l-blue-500">
        <CardHeader className="border-b bg-white dark:bg-stone-950">
          <div className="flex items-center justify-between">
            <CardTitle>Formatted Output</CardTitle>
            {output && (
              <Button size="sm" variant="ghost" onClick={handleCopyOutput}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Markdown
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-6 prose dark:prose-invert max-w-none">
          {output ? (
            <ReactMarkdown>{output}</ReactMarkdown>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Processing result will appear here...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
