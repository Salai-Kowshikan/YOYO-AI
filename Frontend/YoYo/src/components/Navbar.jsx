import { Button } from "./ui/button";
import documentationPdf from "../assets/ConvoCapture-User-Manual.pdf";

function Navbar() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = documentationPdf;
    link.download = "documentation.pdf";
    link.click();
  };

  return (
    <div className="fixed top-0 left-0 w-full shadow-md z-50 flex justify-between items-center p-4 bg-text">
      <div className="text-white font-bold text-2xl">ConvoCapture</div>
      <Button
        className="bg-primary hover:bg-accent text-text font-semibold"
        onClick={handleDownload}
      >
        Documentation
      </Button>
    </div>
  );
}

export default Navbar;
