
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request body
    const requestData = await req.json()
    const { documentId, agentId } = requestData

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Retrieve document info
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (fetchError) {
      console.error('Error fetching document:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch document' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get the file from storage
    const { data: fileData, error: storageError } = await supabase
      .storage
      .from('agent-documents')
      .download(document.file_path)

    if (storageError) {
      console.error('Error downloading file:', storageError)
      return new Response(
        JSON.stringify({ error: 'Failed to download file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get file content based on file type
    let fileContent = ''
    let analysis = ''

    // For text files, we can read the content directly
    if (document.mime_type === 'text/plain') {
      fileContent = await fileData.text()
      // Simple analysis for demonstration
      analysis = `Document contains ${fileContent.split(' ').length} words and ${fileContent.length} characters.`
    } else if (document.mime_type.startsWith('image/')) {
      // For images, provide a basic analysis
      analysis = `Image analysis: ${document.original_filename} (${document.mime_type}) with size ${Math.round(document.file_size / 1024)} KB`
    } else if (document.mime_type === 'application/pdf' || 
               document.mime_type.includes('word')) {
      // For PDFs and Word docs
      analysis = `Document analysis: ${document.original_filename} (${document.mime_type}) with size ${Math.round(document.file_size / 1024)} KB`
    } else {
      analysis = `Basic analysis for ${document.original_filename} (${document.mime_type})`
    }

    // In a production environment, you would use OpenAI or another service here
    // to extract text from PDFs/images and analyze the content

    // Update document with analysis
    const { data: updatedDoc, error: updateError } = await supabase
      .from('documents')
      .update({
        processed: true,
        analysis_summary: analysis
      })
      .eq('id', documentId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating document:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update document' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Return the processed document
    return new Response(
      JSON.stringify({ success: true, document: updatedDoc }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error processing document:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
