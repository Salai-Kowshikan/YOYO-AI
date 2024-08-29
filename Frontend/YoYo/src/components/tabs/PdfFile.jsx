import { useState } from "react";
import api from "@/api/v1";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { systemPrompt } from "@/constants/prompt";

function PdfFile() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const processData = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "llama3.1");
    formData.append("system", systemPrompt);
    formData.append("stream", "false");

    try {
      console.log("Processing data");
      console.log(formData);
      // const response = await api.post("/generate", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col p-8 gap-5 w-3/4 items-center justify-center">
      <Label className="flex-1">Upload PDF file</Label>
      <Input
        type="file"
        id="file-input"
        name="file-input"
        className="hidden"
        accept=".pdf"
        onChange={handleFileChange}
      />
      <Label
        htmlFor="file-input"
        className="flex-1 bg-blue-500 text-white p-2 rounded cursor-pointer text-center"
      >
        {fileName === "No file selected" ? "Upload a file" : fileName}
      </Label>
      <Button onClick={processData}>Process</Button>
    </div>
  );
}

export default PdfFile;
