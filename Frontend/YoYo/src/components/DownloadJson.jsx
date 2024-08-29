import { Button } from '@/components/ui/button';

function DownloadJson({ data }) {
  const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const handleDownload = () => {
    if (!data) return;

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';

    link.click();
  };

  return (
    <div>
      <Button
        onClick={handleDownload}
        disabled={!data || isEmptyObject(data)}
      >
        Download JSON
      </Button>
    </div>
  );
}

export default DownloadJson;