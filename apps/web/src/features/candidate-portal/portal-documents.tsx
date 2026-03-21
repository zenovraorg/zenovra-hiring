import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Upload, FileText, Download, Trash2, File, X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface DocumentItem {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: 'pdf' | 'doc';
}

const initialDocuments: DocumentItem[] = [
  { id: 'd1', name: 'Resume_JamieAnderson.pdf', size: '2.4 MB', uploadedAt: '2024-09-15', type: 'pdf' },
  { id: 'd2', name: 'CoverLetter_Zenovra.pdf', size: '156 KB', uploadedAt: '2024-09-15', type: 'pdf' },
];

export function PortalDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const newDoc: DocumentItem = {
        id: `d${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        type: file.name.endsWith('.pdf') ? 'pdf' : 'doc',
      };
      setDocuments((prev) => [newDoc, ...prev]);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUploadClick = () => {
    const newDoc: DocumentItem = {
      id: `d${Date.now()}`,
      name: 'Portfolio_JamieAnderson.pdf',
      size: '1.8 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      type: 'pdf',
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">My Documents</h1>
        <p className="text-muted-foreground mt-1">Manage your resumes, cover letters, and other documents.</p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
          <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
        </div>
      </motion.div>

      {/* Document List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Uploaded Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {documents.map((doc, index) => (
                  <div key={doc.id}>
                    {index > 0 && <Separator className="my-1" />}
                    <div className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-muted/50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.size} &middot; Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" title="Download">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Delete"
                          onClick={() => handleDelete(doc.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
