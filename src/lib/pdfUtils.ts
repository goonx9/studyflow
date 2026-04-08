import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdfjs-dist
// In a Vite environment, we can use the CDN or a local worker.
// Using CDN for simplicity as per user's "Zero Cost / CDN" hint.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    return extractTextFromPdf(file);
  } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return file.text();
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
  }
}
