
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  agentId: string;
  onDocumentUploaded?: (document: any) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  documentId?: string;
}

const DocumentUpload = ({ agentId, onDocumentUploaded }: DocumentUploadProps) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadingFiles(prev => [...prev, ...newUploads]);

    for (let i = 0; i < newUploads.length; i++) {
      const upload = newUploads[i];
      await uploadFile(upload, i);
    }
  }, [agentId]);

  const uploadFile = async (upload: UploadingFile, index: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = upload.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${upload.file.name}`;
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Update progress during upload
      const updateProgress = (progress: number) => {
        setUploadingFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, progress } : f
        ));
      };

      updateProgress(25);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('agent-documents')
        .upload(filePath, upload.file);

      if (uploadError) throw uploadError;

      updateProgress(50);

      // Create database record
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          filename: fileName,
          original_filename: upload.file.name,
          file_path: data.path,
          file_size: upload.file.size,
          mime_type: upload.file.type,
          uploaded_by_agent: agentId,
          shared_with_agents: [agentId]
        })
        .select()
        .single();

      if (dbError) throw dbError;

      updateProgress(75);

      // Process document with AI
      const { data: processedDoc } = await supabase.functions.invoke('process-document', {
        body: { documentId: document.id, agentId }
      });

      updateProgress(100);

      setUploadingFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'complete', 
          documentId: document.id,
          progress: 100 
        } : f
      ));

      toast({
        title: "Document Uploaded Successfully",
        description: `${upload.file.name} has been uploaded and processed by AI.`
      });

      onDocumentUploaded?.(document);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadingFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'error', 
          error: error.message 
        } : f
      ));

      toast({
        title: "Upload Failed",
        description: `Failed to upload ${upload.file.name}: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Documents for AI Analysis
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop files here, or click to select files
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">PDF</Badge>
            <Badge variant="secondary">Images</Badge>
            <Badge variant="secondary">Word Docs</Badge>
            <Badge variant="secondary">Text Files</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Maximum file size: 50MB
          </p>
        </div>
      </Card>

      {uploadingFiles.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-4">Uploading Files</h4>
          <div className="space-y-3">
            {uploadingFiles.map((upload, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <File className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{upload.file.name}</span>
                    <div className="flex items-center gap-2">
                      {upload.status === 'complete' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {upload.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {upload.status !== 'complete' && upload.status !== 'error' && (
                    <Progress value={upload.progress} className="h-2" />
                  )}
                  {upload.status === 'error' && (
                    <p className="text-xs text-red-600">{upload.error}</p>
                  )}
                  {upload.status === 'complete' && (
                    <p className="text-xs text-green-600">Processed by AI successfully</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
