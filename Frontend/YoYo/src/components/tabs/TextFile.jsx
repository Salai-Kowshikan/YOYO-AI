import { useState } from "react";
import api from "@/api/v1";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { systemPrompt } from "@/constants/prompt";

function TextFile() {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("No file selected");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setFileContent(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };
  
  const processData = async () => {
    try {
      console.log("Processing data");
      const request = {
        model: "llama3.1",
        prompt: fileContent,
        system: systemPrompt,
        stream: false,
      };
      const response = await api.post(
        "/generate",
        request
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-5 w-3/4 items-center justify-center">
      <div className="flex gap-4 items-center w-full">
        <Label className="flex-1">Upload text-files</Label>
        <Input
          type="file"
          id="file-input"
          name="file-input"
          className="hidden"
          accept=".txt"
          onChange={handleFileChange}
        />
        <Label
          htmlFor="file-input"
          className="flex-1 bg-blue-500 text-white p-2 rounded cursor-pointer text-center"
        >
          {fileName === "No file selected" ? "Upload a file" : fileName}
        </Label>
      </div>
      <Button onClick={processData}>Process</Button>
    </div>
  );
}

export default TextFile;
