import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useContext } from "react";
import { GeneralContext } from "@/context/GeneralContext";
import api from "@/api/v1";

function Textinput({setTextData}) {
  const [data, setData] = useState(null);
  const { setLoading } = useContext(GeneralContext);
  const processData = async () => {
    try {
      setLoading(true);
      console.log("Processing data");
      const request = {
        text : data
      };
      const response = await api.post("/text", request);
      console.log(response.data)
      setTextData(response.data)
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
