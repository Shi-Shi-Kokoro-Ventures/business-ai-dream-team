
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Share, Download, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import DocumentUpload from './DocumentUpload';

interface ChatDocumentsPanelProps {
  agentId: string;
}

interface Document {
  id: string;
  original_filename: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  upload_date: string;
  processed: boolean;
  analysis_summary: string | null;
}

const ChatDocumentsPanel = ({ agentId }: ChatDocumentsPanelProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [agentId]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .filter('shared_with_agents', 'cs', `{${agentId}}`)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocument = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('agent-documents')
        .download(doc.file_path);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const link = globalThis.document.createElement('a');
      link.href = url;
      link.download = doc.original_filename;
      globalThis.document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      globalThis.document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const documentToDelete = documents.find(d => d.id === documentId);
      if (!documentToDelete) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('agent-documents')
        .remove([documentToDelete.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      // Update local state
      setDocuments(documents.filter(d => d.id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDocumentUploaded = () => {
    loadDocuments();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsUploading(!isUploading)}
        >
          {isUploading ? 'Cancel' : 'Upload Document'}
        </Button>
      </div>

      {isUploading && (
        <DocumentUpload 
          agentId={agentId} 
          onDocumentUploaded={handleDocumentUploaded} 
        />
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded-md mb-4 w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded-md mb-4 w-1/2 mx-auto"></div>
          </div>
        </Card>
      ) : documents.length === 0 ? (
        <Card className="p-6 text-center">
          <FileText className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No documents shared with this agent.</p>
          <p className="text-sm text-gray-500 mt-2">Upload a document for AI analysis.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-blue-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{doc.original_filename}</h4>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                    <span>{formatFileSize(doc.file_size)}</span>
                    <span>•</span>
                    <span>{new Date(doc.upload_date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{doc.processed ? 'Processed' : 'Processing...'}</span>
                  </div>
                  {doc.analysis_summary && (
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                      {doc.analysis_summary}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => downloadDocument(doc)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => deleteDocument(doc.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatDocumentsPanel;
