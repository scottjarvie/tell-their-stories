"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Play, Brain, Loader2, FileText, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { analyzePrompt } from "@/lib/prompts/analyzePrompt";

export default function AnalyzeToolPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCopyPrompt = () => {
    if (!input) return;
    
    const fullPrompt = `${analyzePrompt}\n\nINPUT DATA:\n${input}`;
    
    navigator.clipboard.writeText(fullPrompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleProcess = async () => {
    if (!input) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: analyzePrompt,
          data: input,
          apiKey: localStorage.getItem("openRouterApiKey"),
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      setOutput(result.content);
      toast.success("Analysis complete!");
    } catch (error: any) {
      toast.error("Processing failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Dossier copied!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      {/* Input Column */}
      <div className="flex flex-col space-y-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Input: Formatted Markdown
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <Textarea 
              placeholder="Paste the Formatted Markdown from the previous step here..." 
              className="h-full font-mono text-sm resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
          <CardFooter className="justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              {input.length > 50 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Ready to analyze ({input.length} chars)
                </span>
              ) : "Waiting for content..."}
            </div>
            <Button variant="outline" onClick={() => setInput("")} disabled={!input}>
              Clear
            </Button>
          </CardFooter>
        </Card>

        {input.length > 50 && (
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
                className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white" 
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
      <Card className="flex flex-col h-full bg-stone-50 dark:bg-stone-900 border-l-4 border-l-purple-500">
        <CardHeader className="border-b bg-white dark:bg-stone-950">
          <div className="flex items-center justify-between">
            <CardTitle>Contextualized Dossier</CardTitle>
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
              Analysis result will appear here...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
