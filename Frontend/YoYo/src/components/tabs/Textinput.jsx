import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import api from "@/api/v1";

function Textinput() {
  const [data, setData] = useState(null);
  const processData = async () => {
    try {
      console.log("Processing data");
      const response = await api.post(
        "/generate",
        {
          model: "llama3.1",
          prompt: "what is the meaning of life?",
          system: "give the response as a JSON",
          stream: false,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col p-8 gap-5 w-3/4 items-center justify-center">
      <div className="flex gap-4 items-center w-full">
        <Label htmlFor="text-input" className="flex-1">
          Paste the conversation here:
        </Label>
        <Textarea
          id="text-input"
          name="text-input"
          className="flex-1"
          onChange={(e) => setData(e.target.value)}
        />
      </div>
      <Button onClick={processData}>Process</Button>
    </div>
  );
}

export default Textinput;
